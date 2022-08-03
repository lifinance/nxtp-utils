import { ChainData } from "./chainData";
/**
 * Domain of the subgraph determines which endpoint we should consult for getting
 * up-to-date info/metadata/URLs, including subgraph health. It represents the
 * subgraph application/use-case.
 *
 * Used as constructor param, and to get the address below.
 */
export declare enum SubgraphDomain {
    COMMON = 0,
    ANALYTICS = 1,
    TEST = 2
}
export declare type SubgraphSyncRecord = {
    name: string;
    synced: boolean;
    latestBlock: number;
    syncedBlock: number;
    lag: number;
    error?: any;
};
export declare const graphQuery: (url: string, query: string) => Promise<any>;
/**
 * @classdesc A class that manages the sync status of multiple subgraphs as well as their corresponding SDKs.
 */
export declare class FallbackSubgraph<T> {
    private readonly chainId;
    private readonly generateClient;
    private readonly maxLag;
    private readonly domain;
    private readonly stallTimeout;
    private static MAX_CPS;
    private static readonly METRIC_WINDOW;
    private readonly subgraphs;
    private readonly syncingQueue;
    private latestSync;
    /**
     * Returns boolean representing whether at least one available subgraph is in sync.
     */
    get inSync(): boolean;
    /**
     * Returns boolean indicating whether we've synchronized the subgraphs at all (indicating
     * whether the records are in fact representative).
     */
    get hasSynced(): boolean;
    get records(): SubgraphSyncRecord[];
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
    constructor(chainId: number, generateClient: (url: string) => T, maxLag: number, domain?: SubgraphDomain, urls?: string[], stallTimeout?: number);
    /**
     * Raw string query method.
     *
     * @param query - GraphQL query string.
     *
     * @returns any, whatever the expected GraphQL response is.
     */
    query(query: string): Promise<any>;
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
    request<Q>(method: (client: T, url: string) => Promise<Q>, syncRequired?: boolean): Promise<Q>;
    /**
     * Check synchronized status of all subgraphs, and update metrics.
     *
     * @param getBlockNumber - callback method to get the chain's current block number.
     * @returns Subgraph sync records for each subgraph.
     */
    sync(getBlockNumber?: () => Promise<number>, ignoreFail?: boolean): Promise<SubgraphSyncRecord[]>;
    private getOrderedSubgraphs;
    /**
     * Utility for creating a subgraph record and filling it out with the default values.
     * Does not add it to this.subgraphs.
     *
     * @param url - The url of the subgraph.
     * @returns Subgraph<T> where the generic type T represents the client SDK type.
     */
    private createSubgraphRecord;
}
export declare const getDeployedAnalyticsSubgraphUrls: (chainId: number, chainData?: Map<string, ChainData>) => string[];
//# sourceMappingURL=fallbackSubgraph.d.ts.map