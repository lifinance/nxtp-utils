"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNxtpNatsMessagingService = exports.RouterNxtpNatsMessagingService = exports.NatsNxtpMessagingService = exports.STATUS_RESPONSE_SUBJECT = exports.STATUS_REQUEST_SUBJECT = exports.METATX_RESPONSE_SUBJECT = exports.METATX_REQUEST_SUBJECT = exports.AUCTION_RESPONSE_SUBJECT = exports.AUCTION_REQUEST_SUBJECT = exports.generateMessagingInbox = exports.MetaTxTypes = exports.AuctionResponseSchema = exports.AuctionBidSchema = exports.AuctionPayloadSchema = exports.NatsBasicMessagingService = exports.getBearerToken = exports.NATS_CLUSTER_URL_LOCAL = exports.NATS_WS_URL_LOCAL = exports.NATS_AUTH_URL_LOCAL = exports.NATS_CLUSTER_URL_TESTNET = exports.NATS_WS_URL_TESTNET = exports.NATS_AUTH_URL_TESTNET = exports.NATS_CLUSTER_URL = exports.NATS_WS_URL = exports.NATS_AUTH_URL = exports.MessagingError = exports.AuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const ts_natsutil_1 = require("ts-natsutil");
const typebox_1 = require("@sinclair/typebox");
const basic_1 = require("./basic");
const env_1 = require("./env");
const json_1 = require("./json");
const error_1 = require("./error");
const request_1 = require("./request");
const logger_1 = require("./logger");
var ts_natsutil_2 = require("ts-natsutil");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return ts_natsutil_2.AuthService; } });
const MESSAGE_PREFIX = `Hi there from Connext! Sign this message to make sure that no one can communicate on the Connext Network on your behalf. This will not cost you any Ether!
  
To stop hackers from using your wallet, here's a unique message ID that they can't guess: `;
/**
 * @classdesc Errors thrown by all messaging classes defined in this file.
 */
class MessagingError extends error_1.NxtpError {
    constructor(message, context = {}) {
        super(message, context, MessagingError.type);
        this.message = message;
        this.context = context;
    }
}
exports.MessagingError = MessagingError;
MessagingError.type = "MessagingError";
MessagingError.reasons = {
    ConfigError: "Error in configuration",
    ConnectionError: "No connection detected",
    VersionError: "Incoming message version not compatible",
};
exports.NATS_AUTH_URL = "https://auth.connext.network";
exports.NATS_WS_URL = "wss://websocket.connext.provide.network";
exports.NATS_CLUSTER_URL = "nats://nats1.connext.provide.network:4222,nats://nats2.connext.provide.network:4222,nats://nats3.connext.provide.network:4222";
exports.NATS_AUTH_URL_TESTNET = exports.NATS_AUTH_URL;
exports.NATS_WS_URL_TESTNET = exports.NATS_WS_URL;
exports.NATS_CLUSTER_URL_TESTNET = exports.NATS_CLUSTER_URL;
exports.NATS_AUTH_URL_LOCAL = "http://localhost:5040";
exports.NATS_WS_URL_LOCAL = "ws://localhost:4221";
exports.NATS_CLUSTER_URL_LOCAL = "nats://localhost:4222";
/**
 * Gets a bearer token by signing the prefix + nonce and sending it to the auth server
 *
 * @param authUrl - URL of NATS auth server
 * @param signer - The signer who is being authed
 * @returns A bearer token
 *
 * TODO: #155 fix typing
 */
const getBearerToken = (authUrl, signer) => async () => {
    const address = await signer.getAddress();
    const nonceResponse = await axios_1.default.get(`${authUrl}/auth/${address}`);
    const nonce = nonceResponse.data;
    const sig = await signer.signMessage(`${MESSAGE_PREFIX}${nonce}`);
    const verifyResponse = await axios_1.default.post(`${authUrl}/auth`, {
        sig,
        signerAddress: address,
    });
    return verifyResponse.data;
};
exports.getBearerToken = getBearerToken;
/**
 * @classdesc Handles all low-level messaging logic (subscribe, publish, request, reply, etc.)
 */
class NatsBasicMessagingService {
    constructor(config) {
        this.log = config.logger || new logger_1.Logger({ level: "info", name: NatsBasicMessagingService.name });
        // create request and method context
        const { requestContext, methodContext } = (0, request_1.createLoggingContext)("NatsBasicMessagingService.constructor");
        // default to live cluster
        if (!config.authUrl) {
            config.authUrl = exports.NATS_AUTH_URL;
        }
        if (!config.natsUrl) {
            config.natsUrl = (0, env_1.isNode)() ? exports.NATS_CLUSTER_URL : exports.NATS_WS_URL;
        }
        this.authUrl = config.authUrl;
        this.natsUrl = config.natsUrl;
        this.log.info("Messaging config generated", requestContext, methodContext, {
            natsUrl: this.natsUrl,
            authUrl: this.authUrl,
        });
        if (config.bearerToken) {
            this.bearerToken = config.bearerToken;
        }
        else if (!config.signer) {
            throw new MessagingError(MessagingError.reasons.ConfigError, { message: `A bearerToken must be provided` });
        }
        this.signer = config.signer;
    }
    /**
     * Returns boolean indicator representing messaging service connection status
     *
     * @returns Boolean indiciating if the messaging service is properly connected
     */
    isConnected() {
        var _a;
        return !!((_a = this.connection) === null || _a === void 0 ? void 0 : _a.isConnected());
    }
    /**
     * Will throw an error if the messaging service is not connected
     */
    assertConnected() {
        if (!this.isConnected()) {
            throw new MessagingError(MessagingError.reasons.ConnectionError, { message: `Use connect() method` });
        }
    }
    /**
     * Will establish a connection to the messaging service.
     *
     * @param bearerToken - (optional) The token to use with the auth server. If not provided, will fetch one
     *
     * @returns The bearer token used for auth
     */
    async connect(bearerToken, _requestContext) {
        const { requestContext, methodContext } = (0, request_1.createLoggingContext)(this.connect.name, _requestContext);
        if (bearerToken) {
            this.bearerToken = bearerToken;
        }
        else if (!this.bearerToken) {
            const token = await (0, exports.getBearerToken)(this.authUrl, this.signer)();
            this.bearerToken = token;
        }
        // TODO: #155 fail fast w sensible error message if bearer token is invalid #446
        const service = (0, ts_natsutil_1.natsServiceFactory)({
            bearerToken: this.bearerToken,
            natsServers: [this.natsUrl],
        }, this.log.child({ module: "Messaging-Nats" }, "debug"));
        let natsConnection;
        try {
            natsConnection = await service.connect();
        }
        catch (e) {
            this.bearerToken = undefined;
            throw e;
        }
        this.connection = service;
        this.log.debug(`Connected!`, requestContext, methodContext);
        if (typeof natsConnection.addEventListener === "function") {
            natsConnection.addEventListener("close", async () => {
                this.bearerToken = undefined;
                await this.connect();
            });
        }
        else {
            natsConnection.on("close", async () => {
                this.bearerToken = undefined;
                await this.connect();
            });
        }
        return this.bearerToken;
    }
    /**
     * Will disconnect the messaging service
     */
    async disconnect() {
        var _a;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    // Generic methods
    /**
     * Publishes a message
     *
     * @param subject - Subject to publish message to
     * @param data - Data to be published
     */
    async publish(subject, data, _requestContext) {
        const { requestContext, methodContext } = (0, request_1.createLoggingContext)(this.publish.name, _requestContext);
        this.assertConnected();
        const toPublish = (0, json_1.safeJsonStringify)(data);
        this.log.debug(`Publishing`, requestContext, methodContext, { subject, data });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        await this.connection.publish(subject, toPublish);
    }
    /**
     * Requests a response from a given subject
     *
     * @param subject - Subject you are requesting a response from
     * @param timeout - Time you are willing to wait for a response in ms. If met, will reject.
     * @param data - Data you include along with your request
     * @returns A response (if received before timeout)
     */
    async request(subject, timeout, data, _requestContext) {
        const { requestContext, methodContext } = (0, request_1.createLoggingContext)(this.request.name, _requestContext);
        this.assertConnected();
        this.log.debug(`Requesting`, requestContext, methodContext, { subject, data });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const response = await this.connection.request(subject, timeout, JSON.stringify(data));
        this.log.debug(`Request returned`, requestContext, methodContext, { subject, response });
        return response;
    }
    /**
     * Registers a handler to be invoked anytime a subject receives a published message
     *
     * @param subject - Unique subject to subscribe to
     * @param callback - Logic to invoke
     */
    async subscribe(subject, callback, _requestContext) {
        const { requestContext, methodContext } = (0, request_1.createLoggingContext)(this.subscribe.name, _requestContext);
        this.assertConnected();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        await this.connection.subscribe(subject, (msg, err) => {
            const parsedMsg = typeof msg === `string` ? JSON.parse(msg) : msg;
            const parsedData = typeof msg.data === `string` ? JSON.parse(msg.data) : msg.data;
            parsedMsg.data = parsedData;
            callback(msg, err);
        });
        this.log.debug("Subscription created", requestContext, methodContext, { subject });
    }
    /**
     * Removes any registered handlers from the specified subject
     *
     * @param subject - Subject to remove handlers from
     */
    async unsubscribe(subject) {
        this.assertConnected();
        const unsubscribeFrom = this.getSubjectsToUnsubscribeFrom(subject);
        unsubscribeFrom.forEach((sub) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            this.connection.unsubscribe(sub);
        });
    }
    /**
     * Flushes the messaging connection
     */
    async flush() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        await this.connection.flush();
    }
    // Helper methods
    /**
     * Gets all full matching subjects that must be unsubscribed from. I.e. if given "*.auction" will unsubscribe from any subjects ending with "-auction"
     *
     * @param subject - Subject to match other subjects against when unsubscribing
     * @returns All full matching subjects to unsubscribe from
     */
    getSubjectsToUnsubscribeFrom(subject) {
        // must account for wildcards
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const subscribedTo = this.connection.getSubscribedSubjects();
        const unsubscribeFrom = [];
        // get all the substrings to match in the existing subscriptions
        // anything after `>` doesnt matter
        // `*` represents any set of characters
        // if no match for split, will return [subject]
        const substrsToMatch = subject.split(`>`)[0].split(`*`);
        subscribedTo.forEach((subscribedSubject) => {
            let subjectIncludesAllSubstrings = true;
            substrsToMatch.forEach((match) => {
                if (!(subscribedSubject !== null && subscribedSubject !== void 0 ? subscribedSubject : "").includes(match) && match !== ``) {
                    subjectIncludesAllSubstrings = false;
                }
            });
            if (subjectIncludesAllSubstrings) {
                unsubscribeFrom.push(subscribedSubject);
            }
        });
        return unsubscribeFrom;
    }
}
exports.NatsBasicMessagingService = NatsBasicMessagingService;
const MESSAGING_VERSION = "0.0.1";
/**
 * Returns trye if the major messaging version matches the current messaging version
 *
 * @param version Received version
 * @returns True if major versions match, false otherwise
 */
const checkMessagingVersionValid = (version) => {
    if (version.split(".")[0] === MESSAGING_VERSION.split(".")[0]) {
        return true;
    }
    else {
        return false;
    }
};
exports.AuctionPayloadSchema = typebox_1.Type.Object({
    user: basic_1.TAddress,
    initiator: basic_1.TAddress,
    sendingChainId: basic_1.TChainId,
    sendingAssetId: basic_1.TAddress,
    amount: basic_1.TIntegerString,
    receivingChainId: basic_1.TChainId,
    receivingAssetId: basic_1.TAddress,
    receivingAddress: basic_1.TAddress,
    expiry: typebox_1.Type.Number(),
    transactionId: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
    encryptedCallData: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]*$/),
    callDataHash: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
    callTo: basic_1.TAddress,
    dryRun: typebox_1.Type.Boolean(),
});
exports.AuctionBidSchema = typebox_1.Type.Object({
    user: basic_1.TAddress,
    router: basic_1.TAddress,
    initiator: basic_1.TAddress,
    sendingChainId: basic_1.TChainId,
    sendingAssetId: basic_1.TAddress,
    amount: basic_1.TIntegerString,
    receivingChainId: basic_1.TChainId,
    receivingAssetId: basic_1.TAddress,
    amountReceived: basic_1.TIntegerString,
    receivingAddress: basic_1.TAddress,
    transactionId: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
    expiry: typebox_1.Type.Number(),
    callDataHash: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
    callTo: basic_1.TAddress,
    encryptedCallData: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]*$/),
    sendingChainTxManagerAddress: basic_1.TAddress,
    receivingChainTxManagerAddress: basic_1.TAddress,
    bidExpiry: typebox_1.Type.Number(),
});
exports.AuctionResponseSchema = typebox_1.Type.Object({
    bid: exports.AuctionBidSchema,
    gasFeeInReceivingToken: basic_1.TIntegerString,
    bidSignature: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.MetaTxTypes = {
    Fulfill: "Fulfill",
    RouterContractPrepare: "RouterContractPrepare",
    RouterContractFulfill: "RouterContractFulfill",
    RouterContractCancel: "RouterContractCancel",
    RouterContractRemoveLiquidity: "RouterContractRemoveLiquidity",
};
/**
 * Creates a unique inbox to use for messaging responses
 * @returns A unique inbox string to receive replies to
 */
const generateMessagingInbox = () => {
    return `_INBOX.${(0, request_1.getUuid)()}`;
};
exports.generateMessagingInbox = generateMessagingInbox;
exports.AUCTION_REQUEST_SUBJECT = "auction.request";
exports.AUCTION_RESPONSE_SUBJECT = "auction.response";
exports.METATX_REQUEST_SUBJECT = "metatx.request";
exports.METATX_RESPONSE_SUBJECT = "metatx.response";
exports.STATUS_REQUEST_SUBJECT = "status.request";
exports.STATUS_RESPONSE_SUBJECT = "status.response";
/**
 * @classdesc Contains the logic for handling all the NATS messaging specific to the nxtp protocol (asserts messaging versions and structure)
 */
// TODO: #155 add AJV structure assertions for the messaging envelopes
class NatsNxtpMessagingService extends NatsBasicMessagingService {
    /**
     * Publishes data to a subject that conforms to the NXTP message structure
     *
     * @param subject - Where to publish data
     * @param data - (optional) Data to publish
     * @param responseInbox - (optional) Where responses should be published
     * @param error - (optional) Error json to be published
     */
    async publishNxtpMessage(subject, data, responseInbox, error, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishNxtpMessage.name);
        const payload = {
            responseInbox,
            data,
            version: MESSAGING_VERSION,
            error,
        };
        await this.publish(subject, payload, requestContext);
    }
    /**
     * Registers some callback to be invoked when a message is received to the provided subject. Will error if the messaging version is not compatible.
     *
     * @param subject - Subject to register callback on
     * @param handler - Callback to be invoked
     */
    async subscribeToNxtpMessage(subject, handler, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToNxtpMessage.name);
        await this.subscribe(subject, (msg, err) => {
            var _a, _b, _c;
            // TODO: #155 validate data structure
            // there was an error, run callback with error
            if (err) {
                return handler((_a = msg === null || msg === void 0 ? void 0 : msg.data) === null || _a === void 0 ? void 0 : _a.data, err);
            }
            if (!checkMessagingVersionValid(msg.data.version)) {
                err = new MessagingError(MessagingError.reasons.VersionError, {
                    receivedVersion: msg.data.version,
                    ourVersion: MESSAGING_VERSION,
                });
                return handler((_b = msg === null || msg === void 0 ? void 0 : msg.data) === null || _b === void 0 ? void 0 : _b.data, err);
            }
            return handler((_c = msg === null || msg === void 0 ? void 0 : msg.data) === null || _c === void 0 ? void 0 : _c.data, err);
        }, requestContext);
    }
    /**
     * Subscribes to a subject and executes the handler with a provided inbox. Should be used when subscribing to subjects where responses are required
     *
     * @param subject - Subject to register callback on
     * @param handler - Callback to be invoked
     */
    async subscribeToNxtpMessageWithInbox(subject, handler, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToNxtpMessageWithInbox.name);
        await this.subscribe(subject, (msg, err) => {
            var _a, _b, _c;
            const from = msg.subject.split(".")[0];
            // TODO: #155 validate data structure
            // there was an error, run callback with error
            if (err) {
                return handler(from, "ERROR", (_a = msg === null || msg === void 0 ? void 0 : msg.data) === null || _a === void 0 ? void 0 : _a.data, err);
            }
            if (!checkMessagingVersionValid(msg.data.version)) {
                err = new MessagingError(MessagingError.reasons.VersionError, {
                    receivedVersion: msg.data.version,
                    ourVersion: MESSAGING_VERSION,
                });
                return handler(from, "ERROR", (_b = msg === null || msg === void 0 ? void 0 : msg.data) === null || _b === void 0 ? void 0 : _b.data, err);
            }
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            return handler(from, msg.data.responseInbox, (_c = msg === null || msg === void 0 ? void 0 : msg.data) === null || _c === void 0 ? void 0 : _c.data, err);
        }, requestContext);
    }
}
exports.NatsNxtpMessagingService = NatsNxtpMessagingService;
/**
 * @classdesc Handles NXTP messaging logic that is specific to the messages a router will need to handle.
 *
 */
class RouterNxtpNatsMessagingService extends NatsNxtpMessagingService {
    /**
     * Subscribes auction response/bidding logic for the routers
     *
     * @param handler - Callback that defines the bid-submission logic when an auction is broadcast
     *
     */
    async subscribeToAuctionRequest(handler, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToAuctionRequest.name);
        await this.subscribeToNxtpMessageWithInbox(`*.*.${exports.AUCTION_REQUEST_SUBJECT}`, (from, inbox, data, err) => {
            return handler(from, inbox, data, err);
        }, requestContext);
    }
    /**
     * Publishes a bid for an auction
     *
     * @param publishInbox - Unique inbox for the auction
     * @param publishInbox - Unique inbox for the auction
     * @param data - Bid information
     */
    async publishAuctionResponse(from, publishInbox, data, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishAuctionResponse.name);
        const signerAddress = await this.signer.getAddress();
        await this.publishNxtpMessage(`${from}.${signerAddress}.${exports.AUCTION_RESPONSE_SUBJECT}`, data, publishInbox, undefined, // error
        requestContext);
    }
    /**
     * Subscribes to the meta transaction requests for relayer
     *
     * @param handler - Callback that attempts to submit the transaction on behalf of the requester
     */
    async subscribeToMetaTxRequest(handler, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToMetaTxRequest.name);
        await this.subscribeToNxtpMessageWithInbox(`*.*.${exports.METATX_REQUEST_SUBJECT}`, (from, inbox, data, err) => {
            return handler(from, inbox, data, err);
        }, requestContext);
    }
    /**
     * Publishes a response to a meta transaction submission request
     *
     * @param publishInbox - Unique inbox for the meta tx request
     * @param data - (optional) Meta transaction response information to return to requester. Not needed if submission failed
     * @param err - (optional) Error when submitting meta transaction. Not needed if submission was successful
     */
    async publishMetaTxResponse(from, publishInbox, data, err, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishMetaTxResponse.name);
        const signerAddress = await this.signer.getAddress();
        await this.publishNxtpMessage(`${from}.${signerAddress}.${exports.METATX_RESPONSE_SUBJECT}`, data, publishInbox, err, requestContext);
    }
    /**
     * Publishes a request for a relayer to submit a transaction on behalf of the user
     *
     * @param data - The meta transaction information
     * @param inbox - (optional) The inbox for relayers to send responses to. If not provided, one will be generated
     * @returns The inbox that will receive responses
     */
    async publishMetaTxRequest(data, inbox, _requestContext) {
        if (!inbox) {
            inbox = (0, exports.generateMessagingInbox)();
        }
        const signerAddress = await this.signer.getAddress();
        await this.publishNxtpMessage(`${signerAddress}.${signerAddress}.${exports.METATX_REQUEST_SUBJECT}`, data, inbox, undefined, // error
        _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishMetaTxRequest.name));
        return { inbox };
    }
    /**
     * Subscribes to the get status requests
     *
     * @param handler - Callback that attempts to get status on behalf of the requester
     */
    async subscribeToStatusRequest(handler, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToStatusRequest.name);
        await this.subscribeToNxtpMessageWithInbox(`*.*.${exports.STATUS_REQUEST_SUBJECT}`, (from, inbox, data, err) => {
            return handler(from, inbox, data, err);
        }, requestContext);
    }
    async publishStatusResponse(from, publishInbox, data, err, _requestContext) {
        const requestContext = _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishStatusResponse.name);
        const signerAddress = await this.signer.getAddress();
        await this.publishNxtpMessage(`${from}.${signerAddress}.${exports.STATUS_RESPONSE_SUBJECT}`, data, publishInbox, err, requestContext);
    }
}
exports.RouterNxtpNatsMessagingService = RouterNxtpNatsMessagingService;
/**
 * @classdesc Handles NXTP messaging logic that is specific to the messages a user will need to handle.
 *
 */
class UserNxtpNatsMessagingService extends NatsNxtpMessagingService {
    /**
     * Publishes an auction request to initiate the crosschain transfer process
     *
     * @param data - Auction information needed by routers to submit bid
     * @param inbox - (optional) Where routers should respond to. If not provided, will be generated
     * @returns The inbox string to expect responses at
     *
     */
    async publishAuctionRequest(data, inbox, _requestContext) {
        if (!inbox) {
            inbox = (0, exports.generateMessagingInbox)();
        }
        const signerAddress = await this.signer.getAddress();
        await this.publishNxtpMessage(`${signerAddress}.${signerAddress}.${exports.AUCTION_REQUEST_SUBJECT}`, data, inbox, undefined, // error
        _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishAuctionRequest.name));
        return { inbox };
    }
    /**
     * Handles any responses by routers to a user-initiated auction
     *
     * @param inbox - Inbox where auction responses are sent
     * @param handler - Callback to be executed when an auction response is receivied
     */
    async subscribeToAuctionResponse(handler, _requestContext) {
        const signerAddress = await this.signer.getAddress();
        await this.subscribeToNxtpMessageWithInbox(`${signerAddress}.*.${exports.AUCTION_RESPONSE_SUBJECT}`, (from, inbox, data, err) => {
            return handler(from, inbox, data, err);
        }, _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToAuctionResponse.name));
    }
    /**
     * Publishes a request for a relayer to submit a transaction on behalf of the user
     *
     * @param data - The meta transaction information
     * @param inbox - (optional) The inbox for relayers to send responses to. If not provided, one will be generated
     * @returns The inbox that will receive responses
     */
    async publishMetaTxRequest(data, inbox, _requestContext) {
        if (!inbox) {
            inbox = (0, exports.generateMessagingInbox)();
        }
        const signerAddress = await this.signer.getAddress();
        await this.publishNxtpMessage(`${signerAddress}.${signerAddress}.${exports.METATX_REQUEST_SUBJECT}`, data, inbox, undefined, // error
        _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishMetaTxRequest.name));
        return { inbox };
    }
    /**
     * Handles any responses by relayers to a meta transaction submission
     *
     * @param inbox - Where relayers will be sending responses
     * @param handler - Callback to handle relayer responses
     */
    async subscribeToMetaTxResponse(handler, _requestContext) {
        const signerAddress = await this.signer.getAddress();
        await this.subscribeToNxtpMessageWithInbox(`${signerAddress}.*.${exports.METATX_RESPONSE_SUBJECT}`, (from, inbox, data, err) => {
            return handler(from, inbox, data, err);
        }, _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToMetaTxResponse.name));
    }
    async publishStatusRequest(data, inbox, _requestContext) {
        if (!inbox) {
            inbox = (0, exports.generateMessagingInbox)();
        }
        const signerAddress = await this.signer.getAddress();
        await this.publishNxtpMessage(`${signerAddress}.${signerAddress}.${exports.STATUS_REQUEST_SUBJECT}`, data, inbox, undefined, // error
        _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.publishStatusRequest.name));
        return { inbox };
    }
    async subscribeToStatusResponse(handler, _requestContext) {
        const signerAddress = await this.signer.getAddress();
        await this.subscribeToNxtpMessageWithInbox(`${signerAddress}.*.${exports.STATUS_RESPONSE_SUBJECT}`, (from, inbox, data, err) => {
            return handler(from, inbox, data, err);
        }, _requestContext !== null && _requestContext !== void 0 ? _requestContext : (0, request_1.createRequestContext)(this.subscribeToStatusResponse.name));
    }
}
exports.UserNxtpNatsMessagingService = UserNxtpNatsMessagingService;
//# sourceMappingURL=messaging.js.map