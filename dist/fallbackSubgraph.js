"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeployedAnalyticsSubgraphUrls = exports.FallbackSubgraph = exports.graphQuery = exports.SubgraphDomain = void 0;
const axios_1 = __importDefault(require("axios"));
const graphql_request_1 = require("graphql-request");
const p_queue_1 = __importDefault(require("p-queue"));
const error_1 = require("./error");
// TODO: This is a great starting point for moving implementations of graphqlsdk-generated
// code based on use-case:
/**
 * Domain of the subgraph determines which endpoint we should consult for getting
 * up-to-date info/metadata/URLs, including subgraph health. It represents the
 * subgraph application/use-case.
 *
 * Used as constructor param, and to get the address below.
 */
var SubgraphDomain;
(function (SubgraphDomain) {
    SubgraphDomain[SubgraphDomain["COMMON"] = 0] = "COMMON";
    SubgraphDomain[SubgraphDomain["ANALYTICS"] = 1] = "ANALYTICS";
    SubgraphDomain[SubgraphDomain["TEST"] = 2] = "TEST";
})(SubgraphDomain = exports.SubgraphDomain || (exports.SubgraphDomain = {}));
// TODO: Would be cool if we could pass in like, 1/4 * maxLag * blockLengthMs (and get the blockLengthMs from chain reader, which determines that value on init)
const SYNC_CACHE_TTL = 5000;
const DOMAIN_ADDRESS = {
    [SubgraphDomain.COMMON]: "https://subgraph-ts-worker.connext.workers.dev/subgraph_health",
    // TODO: Analytics health endpoint needs to be implemented.
    [SubgraphDomain.ANALYTICS]: undefined,
    // Used for unit testing.
    [SubgraphDomain.TEST]: "test",
};
const graphQuery = async (url, query) => {
    return await (0, graphql_request_1.request)(url, query);
};
exports.graphQuery = graphQuery;
const withRetries = async (method) => {
    for (let i = 0; i < 5; i++) {
        try {
            return await method();
        }
        catch (e) {
            if (e.errno !== "ENOTFOUND") {
                throw e;
            }
        }
    }
};
const getSubgraphName = (url) => {
    const split = url.split("/");
    return split[split.length - 1];
};
/**
 * @classdesc A class that manages the sync status of multiple subgraphs as well as their corresponding SDKs.
 */
class FallbackSubgraph {
    /**
     *
     * @param chainId - Chain ID of the subgraphs.
     * @param sdks - SDK clients along with corresponding URIs used for each subgraph.
     * @param maxLag - Maximum lag value a subgraph can have before it's considered out of sync.
     * @param domain (default: COMMON) - type of subgraph we are using, whether its the common
     * @param urls - Preset urls; FallbackSubgraph creates a new empty record for each.
     * @param stallTimeout - the ms we wait until considering a subgraph RPC call to be a timeout.
     * domain (used for transactions) or the analytics domain.
     */
    constructor(chainId, generateClient, maxLag, domain = SubgraphDomain.COMMON, urls = [], stallTimeout = 10000) {
        this.chainId = chainId;
        this.generateClient = generateClient;
        this.maxLag = maxLag;
        this.domain = domain;
        this.stallTimeout = stallTimeout;
        this.subgraphs = new Map();
        // Syncing queue used to serialize sync calls and for awaiting initial sync to finish when requests
        // are first made.
        this.syncingQueue = new p_queue_1.default({ concurrency: 1 });
        this.latestSync = 0;
        // Add in any configured subgraph urls we want to use.
        urls.forEach((url) => {
            this.subgraphs.set(url, this.createSubgraphRecord(url));
        });
        this.sync(undefined, true);
    }
    /**
     * Returns boolean representing whether at least one available subgraph is in sync.
     */
    get inSync() {
        return Object.values(this.subgraphs).some((subgraph) => subgraph.record.synced);
    }
    /**
     * Returns boolean indicating whether we've synchronized the subgraphs at all (indicating
     * whether the records are in fact representative).
     */
    get hasSynced() {
        return Object.values(this.subgraphs).some((subgraph) => subgraph.record.syncedBlock !== -1 && subgraph.record.latestBlock !== -1);
    }
    get records() {
        return this.getOrderedSubgraphs().map((sdk) => sdk.record);
    }
    /**
     * Raw string query method.
     *
     * @param query - GraphQL query string.
     *
     * @returns any, whatever the expected GraphQL response is.
     */
    async query(query) {
        return this.request((_, url) => {
            return (0, exports.graphQuery)(url, query);
        }, false);
    }
    /**
     * Make an SDK request using the fallback subgraph wrapper.
     *
     * @param method - anonymous callback function that takes an SdkLike client and executes a subgraph sdk method.
     * @param syncRequired - whether it's required for the subgraphs to be in-sync for this call, or if we can tolerate
     *  them being out of sync.
     * @param minBlock - minimum block number for the subgraphs to be in-sync to for this call.
     * @returns A Promise of the generic type.
     * @throws Error if the subgraphs are out of sync (and syncRequired is true).
     */
    async request(method, syncRequired = false) {
        // If subgraph sync is requied, we'll check that all subgraphs are in sync before making the request.
        if (syncRequired && !this.inSync) {
            throw new error_1.NxtpError("All subgraphs out of sync on this chain; unable to handle request.", {
                chainId: this.chainId,
                syncRequired,
                hasSynced: this.hasSynced,
                inSync: this.inSync,
            });
        }
        // If we are currently syncing, we ought to wait until the sync is complete before proceeding to ensure
        // we're operating on up-to-date information (and ensure that we have indeed synced at least once).
        await this.syncingQueue.onIdle();
        // Get the sdks in order of determined priority.
        const orderedSubgraphs = this.getOrderedSubgraphs();
        if (orderedSubgraphs.length === 0) {
            // Sanity check to throw a particular error.
            throw new error_1.NxtpError("No subgraphs available on this chain; unable to handle request.", {
                chainId: this.chainId,
                subgraphs: orderedSubgraphs,
                syncRequired,
                hasSynced: this.hasSynced,
                inSync: this.inSync,
            });
        }
        const errors = [];
        // Try each subgraph client in order of priority.
        for (const subgraph of orderedSubgraphs) {
            try {
                return await Promise.race([
                    new Promise(async (resolve, reject) => {
                        const startTime = Date.now();
                        let success = false;
                        try {
                            const result = await withRetries(async () => await method(subgraph.client, subgraph.url));
                            success = true;
                            resolve(result);
                        }
                        catch (e) {
                            reject(e);
                        }
                        finally {
                            subgraph.metrics.calls.push({
                                timestamp: startTime,
                                // Exec time is measured in seconds.
                                execTime: (Date.now() - startTime) / 1000,
                                success,
                            });
                        }
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new error_1.NxtpError("Timeout")), this.stallTimeout)),
                ]);
            }
            catch (e) {
                errors.push(e);
            }
        }
        throw new error_1.NxtpError("Unable to handle request", {
            errors,
            chainId: this.chainId,
            subgraphs: orderedSubgraphs,
            syncRequired,
            hasSynced: this.hasSynced,
            inSync: this.inSync,
        });
    }
    /**
     * Check synchronized status of all subgraphs, and update metrics.
     *
     * @param getBlockNumber - callback method to get the chain's current block number.
     * @returns Subgraph sync records for each subgraph.
     */
    async sync(getBlockNumber, ignoreFail = false) {
        // Check to make sure this subgraph domain has an endpoint.
        const endpoint = DOMAIN_ADDRESS[this.domain];
        if (!endpoint) {
            // Cannot get subgraph health.
            return this.records;
        }
        // Calling this bit within the serialized queue as a sort of thread-lock for syncing calls.
        await this.syncingQueue.add(async () => {
            // If the latest sync was within SYNC_CACHE_TTL, do not requery. This, along with the
            // serialized queue, enforce a minimum parity.
            if (Date.now() - this.latestSync < SYNC_CACHE_TTL) {
                return;
            }
            // Target this chain's endpoint.
            const endpointUrl = endpoint.concat(`/?chainId=${this.chainId}`);
            let response = undefined;
            let endpointError = undefined;
            try {
                response = await withRetries(async () => {
                    return await axios_1.default.get(endpointUrl);
                });
            }
            catch (e) {
                endpointError = e;
            }
            // Check to make sure the health endpoint does support this chain. If it isn't supported, we
            // need to resort to getting the subgraph's synced block number directly and comparing it to
            // the chain's block number instead.
            const healthEndpointSupported = response && response.data && Array.isArray(response.data) && response.data.length > 0 && !response.data.toString().includes("No subgraph for");
            // Check to make sure that the subgraphs do indeed have a GetBlockNumber method, if we need to
            // fall back to that.
            const getBlockNumberSupported = !!getBlockNumber &&
                Array.from(this.subgraphs.values()).every((subgraph) => !!subgraph.client.GetBlockNumber);
            if (healthEndpointSupported) {
                const chainHeadBlock = Math.max(...response.data.map((item) => item.data.chainHeadBlock));
                // Parse the response, handle each subgraph in the response.
                response.data.forEach((item) => {
                    var _a;
                    const info = item.data;
                    // If we don't have this subgraph mapped, create a new one to work with.
                    const subgraph = (_a = this.subgraphs.get(item.url)) !== null && _a !== void 0 ? _a : this.createSubgraphRecord(item.url);
                    const syncedBlock = info.syncedBlock;
                    const latestBlock = chainHeadBlock;
                    const lag = syncedBlock ? latestBlock - syncedBlock : undefined;
                    const synced = lag ? lag <= this.maxLag : info.synced ? info.synced : true;
                    // Update the record accordingly.
                    subgraph.record = {
                        ...subgraph.record,
                        synced,
                        latestBlock: latestBlock,
                        syncedBlock: syncedBlock !== null && syncedBlock !== void 0 ? syncedBlock : subgraph.record.syncedBlock,
                        // Want to avoid a lag value of -1, which happens due to asyncronous reporting of latest
                        // block vs synced block.
                        lag: Math.max(0, lag !== null && lag !== void 0 ? lag : this.maxLag),
                        error: info.fatalError,
                    };
                    this.subgraphs.set(item.url, subgraph);
                });
            }
            else if (getBlockNumberSupported) {
                const _latestBlock = getBlockNumber();
                await Promise.all(Array.from(this.subgraphs.values()).map(async (subgraph) => {
                    try {
                        const { _meta } = await withRetries(async () => await subgraph.client.GetBlockNumber());
                        const syncedBlockValid = _meta && _meta.block && _meta.block.number && !isNaN(parseInt(_meta.block.number));
                        const syncedBlock = syncedBlockValid ? parseInt(_meta.block.number) : 0;
                        const latestBlock = await _latestBlock;
                        const lag = latestBlock && syncedBlock ? latestBlock - syncedBlock : undefined;
                        const synced = lag ? lag <= this.maxLag : true;
                        // Update the record accordingly.
                        subgraph.record = {
                            ...subgraph.record,
                            synced,
                            latestBlock: latestBlock,
                            syncedBlock: syncedBlock !== null && syncedBlock !== void 0 ? syncedBlock : subgraph.record.syncedBlock,
                            // Want to avoid a lag value of -1, which happens due to asyncronous reporting of latest
                            // block vs synced block.
                            lag: Math.max(0, lag !== null && lag !== void 0 ? lag : this.maxLag),
                        };
                        this.subgraphs.set(subgraph.url, subgraph);
                    }
                    catch (e) {
                        // Update only the error field in the record.
                        subgraph.record = {
                            ...subgraph.record,
                            error: e,
                        };
                        this.subgraphs.set(subgraph.url, subgraph);
                    }
                }));
            }
            else if (!ignoreFail) {
                // No syncing routes are available, so update all records to show this.
                Array.from(this.subgraphs.values()).forEach((subgraph) => {
                    const error = new error_1.NxtpError("Health endpoint and chain reader unavailable for chain; unable to handle request to sync.", {
                        chainId: this.chainId,
                        hasSynced: this.hasSynced,
                        inSync: this.inSync,
                        healthEndpointSupported,
                        getBlockNumberSupported,
                        subgraphs: Array.from(this.subgraphs.values()),
                        endpointError,
                    });
                    subgraph.record = {
                        ...subgraph.record,
                        error,
                    };
                    this.subgraphs.set(subgraph.url, subgraph);
                });
            }
            // Set the latest sync to now.
            if (!ignoreFail) {
                this.latestSync = Date.now();
            }
        });
        return this.records;
    }
    getOrderedSubgraphs() {
        // Order the subgraphs based on these metrics:
        // 1. Lag, which is the difference between the latest block and the subgraph's latest block.
        // 2. CPS, which is the number of calls per second the subgraph has been making (averaged over last N calls).
        // 3. Reliability, which is how often RPC calls to that subgraph are successful / total calls out of last N calls.
        // 4. Average execution time, which is the average execution time of the last N calls.
        const subgraphs = Array.from(this.subgraphs.values());
        subgraphs.forEach((subgraph) => {
            var _a, _b, _c, _d;
            // Get the last N calls (we will replace the calls property with the return value below).
            const calls = subgraph.metrics.calls.slice(-FallbackSubgraph.METRIC_WINDOW);
            // Average calls per second over the window.
            const tsWindowStart = (_b = (_a = calls[0]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : 0;
            const tsWindowEnd = (_d = (_c = calls[calls.length - 1]) === null || _c === void 0 ? void 0 : _c.timestamp) !== null && _d !== void 0 ? _d : 0;
            const tsWindow = tsWindowEnd - tsWindowStart;
            // Timestamp window must be >= 1 second for sufficient sample size.
            const cps = tsWindow >= 1 ? calls.length / tsWindow : 0;
            // Average execution time for each call.
            const avgExecTime = calls.reduce((sum, call) => sum + call.execTime, 0) / calls.length;
            // Reliability is the ratio of successful calls to total calls.
            const reliability = calls.filter((call) => call.success).length / calls.length;
            subgraph.metrics = {
                calls,
                cps,
                avgExecTime,
                reliability,
            };
            subgraph.priority =
                subgraph.record.lag -
                    subgraph.metrics.cps / FallbackSubgraph.MAX_CPS -
                    subgraph.metrics.reliability +
                    subgraph.metrics.avgExecTime;
        });
        // Always start with the in sync subgraphs and then concat the out of sync subgraphs.
        // Metrics should only come in to play to sort subgraph call order within each group (i.e. we should never prioritize
        // an out-of-sync subgraph over a synced one).
        return subgraphs
            .filter((subgraph) => subgraph.record.synced)
            .sort((subgraphA, subgraphB) => subgraphA.priority - subgraphB.priority)
            .concat(subgraphs.filter((subgraph) => !subgraph.record.synced))
            .sort((subgraphA, subgraphB) => subgraphA.priority - subgraphB.priority);
    }
    /**
     * Utility for creating a subgraph record and filling it out with the default values.
     * Does not add it to this.subgraphs.
     *
     * @param url - The url of the subgraph.
     * @returns Subgraph<T> where the generic type T represents the client SDK type.
     */
    createSubgraphRecord(url) {
        return {
            url,
            client: this.generateClient(url),
            record: {
                name: getSubgraphName(url),
                synced: true,
                latestBlock: -1,
                syncedBlock: -1,
                lag: 0,
                error: undefined,
            },
            priority: 0,
            metrics: {
                calls: [],
                cps: 0,
                reliability: 0,
                avgExecTime: 0,
            },
        };
    }
}
exports.FallbackSubgraph = FallbackSubgraph;
// Target maximum calls per second. Subgraphs can be called more than this per second, but it's
// considered not preferable.
FallbackSubgraph.MAX_CPS = 10;
// Target number of samples in the call metrics for each subgraph call.
FallbackSubgraph.METRIC_WINDOW = 100;
// TODO: Remove, replace with API call / hosted data.
const getDeployedAnalyticsSubgraphUrls = (chainId, chainData) => {
    var _a;
    if (chainData) {
        const subgraph = (_a = chainData.get(chainId.toString())) === null || _a === void 0 ? void 0 : _a.analyticsSubgraph;
        if (subgraph) {
            return subgraph;
        }
    }
    switch (chainId) {
        // testnets
        case 3:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-ropsten-v1-analytics"];
        case 4:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-rinkeby-v1-analytics"];
        case 5:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-goerli-v1-analytics"];
        case 42:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-kovan-v1-analytics"];
        case 69:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-optimism-kovan-v1-analytics"];
        case 97:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-chapel-v1-analytics"];
        case 80001:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-mumbai-v1-analytics"];
        case 421611:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-arbitrum-rinkeby-v1-analytics"];
        // mainnets
        case 1:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-mainnet-v1-analytics"];
        case 10:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-optimism-v1-analytics"];
        case 56:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-bsc-v1-analytics"];
        case 100:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-xdai-v1-analytics"];
        case 122:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-fuse-v1-analytics"];
        case 137:
            return ["https://connext.bwarelabs.com/subgraphs/name/connext/nxtp-matic-v1-analytics"];
        case 250:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-fantom-v1-analytics"];
        case 1285:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-moonriver-v1-analytics"];
        case 42161:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-arbitrum-one-v1-analytics"];
        case 43114:
            return ["https://api.thegraph.com/subgraphs/name/connext/nxtp-avalanche-v1-analytics"];
        default:
            return [];
    }
};
exports.getDeployedAnalyticsSubgraphUrls = getDeployedAnalyticsSubgraphUrls;
//# sourceMappingURL=fallbackSubgraph.js.map