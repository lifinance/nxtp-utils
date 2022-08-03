import { Signer } from "ethers";
import { Static } from "@sinclair/typebox";
import { NxtpError, NxtpErrorJson, Values } from "./error";
import { CancelParams, FulfillParams, PrepareParams, RemoveLiquidityParams } from "./transactionManager";
import { RequestContext } from "./request";
import { Logger } from "./logger";
export { AuthService } from "ts-natsutil";
/**
 * @classdesc Errors thrown by all messaging classes defined in this file.
 */
export declare class MessagingError extends NxtpError {
    readonly message: Values<typeof MessagingError.reasons> | string;
    readonly context: any;
    static readonly type = "MessagingError";
    static readonly reasons: {
        ConfigError: string;
        ConnectionError: string;
        VersionError: string;
    };
    constructor(message: Values<typeof MessagingError.reasons> | string, context?: any);
}
export declare const NATS_AUTH_URL = "https://auth.connext.network";
export declare const NATS_WS_URL = "wss://websocket.connext.provide.network";
export declare const NATS_CLUSTER_URL = "nats://nats1.connext.provide.network:4222,nats://nats2.connext.provide.network:4222,nats://nats3.connext.provide.network:4222";
export declare const NATS_AUTH_URL_TESTNET = "https://auth.connext.network";
export declare const NATS_WS_URL_TESTNET = "wss://websocket.connext.provide.network";
export declare const NATS_CLUSTER_URL_TESTNET = "nats://nats1.connext.provide.network:4222,nats://nats2.connext.provide.network:4222,nats://nats3.connext.provide.network:4222";
export declare const NATS_AUTH_URL_LOCAL = "http://localhost:5040";
export declare const NATS_WS_URL_LOCAL = "ws://localhost:4221";
export declare const NATS_CLUSTER_URL_LOCAL = "nats://localhost:4222";
export declare type MessagingConfig = {
    signer: Signer;
    authUrl?: string;
    natsUrl?: string;
    bearerToken?: string;
    logger?: Logger;
};
/**
 * Gets a bearer token by signing the prefix + nonce and sending it to the auth server
 *
 * @param authUrl - URL of NATS auth server
 * @param signer - The signer who is being authed
 * @returns A bearer token
 *
 * TODO: #155 fix typing
 */
export declare const getBearerToken: (authUrl: string, signer: Signer) => () => Promise<string>;
/**
 * @classdesc Handles all low-level messaging logic (subscribe, publish, request, reply, etc.)
 */
export declare class NatsBasicMessagingService {
    private connection;
    private log;
    private authUrl;
    private bearerToken?;
    private natsUrl?;
    protected signer: Signer;
    constructor(config: MessagingConfig);
    /**
     * Returns boolean indicator representing messaging service connection status
     *
     * @returns Boolean indiciating if the messaging service is properly connected
     */
    isConnected(): boolean;
    /**
     * Will throw an error if the messaging service is not connected
     */
    assertConnected(): void;
    /**
     * Will establish a connection to the messaging service.
     *
     * @param bearerToken - (optional) The token to use with the auth server. If not provided, will fetch one
     *
     * @returns The bearer token used for auth
     */
    connect(bearerToken?: string, _requestContext?: RequestContext): Promise<string>;
    /**
     * Will disconnect the messaging service
     */
    disconnect(): Promise<void>;
    /**
     * Publishes a message
     *
     * @param subject - Subject to publish message to
     * @param data - Data to be published
     */
    publish<T = any>(subject: string, data: T, _requestContext?: RequestContext): Promise<void>;
    /**
     * Requests a response from a given subject
     *
     * @param subject - Subject you are requesting a response from
     * @param timeout - Time you are willing to wait for a response in ms. If met, will reject.
     * @param data - Data you include along with your request
     * @returns A response (if received before timeout)
     */
    request<T = any, V = any>(subject: string, timeout: number, data: T, _requestContext?: RequestContext): Promise<V>;
    /**
     * Registers a handler to be invoked anytime a subject receives a published message
     *
     * @param subject - Unique subject to subscribe to
     * @param callback - Logic to invoke
     */
    subscribe(subject: string, callback: (msg: any, err?: any) => void, _requestContext?: RequestContext): Promise<void>;
    /**
     * Removes any registered handlers from the specified subject
     *
     * @param subject - Subject to remove handlers from
     */
    unsubscribe(subject: string): Promise<void>;
    /**
     * Flushes the messaging connection
     */
    flush(): Promise<void>;
    /**
     * Gets all full matching subjects that must be unsubscribed from. I.e. if given "*.auction" will unsubscribe from any subjects ending with "-auction"
     *
     * @param subject - Subject to match other subjects against when unsubscribing
     * @returns All full matching subjects to unsubscribe from
     */
    protected getSubjectsToUnsubscribeFrom(subject: string): string[];
}
export declare type NxtpMessageEnvelope<T> = {
    version: string;
    data?: T;
    responseInbox?: string;
    error?: NxtpErrorJson;
};
export declare const AuctionPayloadSchema: import("@sinclair/typebox").TObject<{
    user: import("@sinclair/typebox").TString;
    initiator: import("@sinclair/typebox").TString;
    sendingChainId: import("@sinclair/typebox").TNumber;
    sendingAssetId: import("@sinclair/typebox").TString;
    amount: import("@sinclair/typebox").TString;
    receivingChainId: import("@sinclair/typebox").TNumber;
    receivingAssetId: import("@sinclair/typebox").TString;
    receivingAddress: import("@sinclair/typebox").TString;
    expiry: import("@sinclair/typebox").TNumber;
    transactionId: import("@sinclair/typebox").TString;
    encryptedCallData: import("@sinclair/typebox").TString;
    callDataHash: import("@sinclair/typebox").TString;
    callTo: import("@sinclair/typebox").TString;
    dryRun: import("@sinclair/typebox").TBoolean;
}>;
export declare type AuctionPayload = Static<typeof AuctionPayloadSchema>;
export declare const AuctionBidSchema: import("@sinclair/typebox").TObject<{
    user: import("@sinclair/typebox").TString;
    router: import("@sinclair/typebox").TString;
    initiator: import("@sinclair/typebox").TString;
    sendingChainId: import("@sinclair/typebox").TNumber;
    sendingAssetId: import("@sinclair/typebox").TString;
    amount: import("@sinclair/typebox").TString;
    receivingChainId: import("@sinclair/typebox").TNumber;
    receivingAssetId: import("@sinclair/typebox").TString;
    amountReceived: import("@sinclair/typebox").TString;
    receivingAddress: import("@sinclair/typebox").TString;
    transactionId: import("@sinclair/typebox").TString;
    expiry: import("@sinclair/typebox").TNumber;
    callDataHash: import("@sinclair/typebox").TString;
    callTo: import("@sinclair/typebox").TString;
    encryptedCallData: import("@sinclair/typebox").TString;
    sendingChainTxManagerAddress: import("@sinclair/typebox").TString;
    receivingChainTxManagerAddress: import("@sinclair/typebox").TString;
    bidExpiry: import("@sinclair/typebox").TNumber;
}>;
export declare type AuctionBid = Static<typeof AuctionBidSchema>;
export declare const AuctionResponseSchema: import("@sinclair/typebox").TObject<{
    bid: import("@sinclair/typebox").TObject<{
        user: import("@sinclair/typebox").TString;
        router: import("@sinclair/typebox").TString;
        initiator: import("@sinclair/typebox").TString;
        sendingChainId: import("@sinclair/typebox").TNumber;
        sendingAssetId: import("@sinclair/typebox").TString;
        amount: import("@sinclair/typebox").TString;
        receivingChainId: import("@sinclair/typebox").TNumber;
        receivingAssetId: import("@sinclair/typebox").TString;
        amountReceived: import("@sinclair/typebox").TString;
        receivingAddress: import("@sinclair/typebox").TString;
        transactionId: import("@sinclair/typebox").TString;
        expiry: import("@sinclair/typebox").TNumber;
        callDataHash: import("@sinclair/typebox").TString;
        callTo: import("@sinclair/typebox").TString;
        encryptedCallData: import("@sinclair/typebox").TString;
        sendingChainTxManagerAddress: import("@sinclair/typebox").TString;
        receivingChainTxManagerAddress: import("@sinclair/typebox").TString;
        bidExpiry: import("@sinclair/typebox").TNumber;
    }>;
    gasFeeInReceivingToken: import("@sinclair/typebox").TString;
    bidSignature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare type AuctionResponse = Static<typeof AuctionResponseSchema>;
export declare type StatusResponse = {
    isRouterContract: boolean;
    routerVersion: string;
    routerAddress: string;
    signerAddress: string;
    trackerLength: number;
    activeTransactionsLength: number;
    swapPools: Record<number, string[]>;
    supportedChains: number[];
};
export declare const MetaTxTypes: {
    readonly Fulfill: "Fulfill";
    readonly RouterContractPrepare: "RouterContractPrepare";
    readonly RouterContractFulfill: "RouterContractFulfill";
    readonly RouterContractCancel: "RouterContractCancel";
    readonly RouterContractRemoveLiquidity: "RouterContractRemoveLiquidity";
};
export declare type MetaTxType = typeof MetaTxTypes[keyof typeof MetaTxTypes];
export declare type MetaTxPayloads = {
    [MetaTxTypes.Fulfill]: MetaTxFulfillPayload;
    [MetaTxTypes.RouterContractPrepare]: MetaTxRouterContractPreparePayload;
    [MetaTxTypes.RouterContractFulfill]: MetaTxRouterContractFulfillPayload;
    [MetaTxTypes.RouterContractCancel]: MetaTxRouterContractCancelPayload;
    [MetaTxTypes.RouterContractRemoveLiquidity]: MetaTxRouterContractRemoveLiquidityPayload;
};
export declare type MetaTxFulfillPayload = FulfillParams & {
    callDataGas?: string;
};
export declare type MetaTxRouterContractPreparePayload = {
    params: PrepareParams;
    relayerFee: string;
    relayerFeeAsset: string;
    signature: string;
};
export declare type MetaTxRouterContractCancelPayload = {
    params: CancelParams;
    relayerFee: string;
    relayerFeeAsset: string;
    signature: string;
};
export declare type MetaTxRouterContractFulfillPayload = {
    params: FulfillParams;
    relayerFee: string;
    relayerFeeAsset: string;
    signature: string;
};
export declare type MetaTxRouterContractRemoveLiquidityPayload = {
    params: RemoveLiquidityParams;
    relayerFee: string;
    relayerFeeAsset: string;
    signature: string;
};
export declare type MetaTxPayload<T extends MetaTxType> = {
    type: T;
    to: string;
    data: MetaTxPayloads[T];
    chainId: number;
};
export declare type MetaTxResponse = {
    transactionHash: string;
    chainId: number;
};
/**
 * Creates a unique inbox to use for messaging responses
 * @returns A unique inbox string to receive replies to
 */
export declare const generateMessagingInbox: () => string;
export declare const AUCTION_REQUEST_SUBJECT = "auction.request";
export declare const AUCTION_RESPONSE_SUBJECT = "auction.response";
export declare const METATX_REQUEST_SUBJECT = "metatx.request";
export declare const METATX_RESPONSE_SUBJECT = "metatx.response";
export declare const STATUS_REQUEST_SUBJECT = "status.request";
export declare const STATUS_RESPONSE_SUBJECT = "status.response";
/**
 * @classdesc Contains the logic for handling all the NATS messaging specific to the nxtp protocol (asserts messaging versions and structure)
 */
export declare class NatsNxtpMessagingService extends NatsBasicMessagingService {
    /**
     * Publishes data to a subject that conforms to the NXTP message structure
     *
     * @param subject - Where to publish data
     * @param data - (optional) Data to publish
     * @param responseInbox - (optional) Where responses should be published
     * @param error - (optional) Error json to be published
     */
    protected publishNxtpMessage<T>(subject: string, data?: T, responseInbox?: string, error?: NxtpErrorJson, _requestContext?: RequestContext): Promise<void>;
    /**
     * Registers some callback to be invoked when a message is received to the provided subject. Will error if the messaging version is not compatible.
     *
     * @param subject - Subject to register callback on
     * @param handler - Callback to be invoked
     */
    protected subscribeToNxtpMessage<T>(subject: string, handler: (data?: T, err?: any) => void, _requestContext?: RequestContext): Promise<void>;
    /**
     * Subscribes to a subject and executes the handler with a provided inbox. Should be used when subscribing to subjects where responses are required
     *
     * @param subject - Subject to register callback on
     * @param handler - Callback to be invoked
     */
    protected subscribeToNxtpMessageWithInbox<T>(subject: string, handler: (from: string, inbox: string, data?: T, err?: NxtpErrorJson) => void, _requestContext?: RequestContext): Promise<void>;
}
/**
 * @classdesc Handles NXTP messaging logic that is specific to the messages a router will need to handle.
 *
 */
export declare class RouterNxtpNatsMessagingService extends NatsNxtpMessagingService {
    /**
     * Subscribes auction response/bidding logic for the routers
     *
     * @param handler - Callback that defines the bid-submission logic when an auction is broadcast
     *
     */
    subscribeToAuctionRequest(handler: (from: string, inbox: string, data?: AuctionPayload, err?: NxtpErrorJson) => void, _requestContext?: RequestContext): Promise<void>;
    /**
     * Publishes a bid for an auction
     *
     * @param publishInbox - Unique inbox for the auction
     * @param publishInbox - Unique inbox for the auction
     * @param data - Bid information
     */
    publishAuctionResponse(from: string, publishInbox: string, data: AuctionResponse, _requestContext?: RequestContext): Promise<void>;
    /**
     * Subscribes to the meta transaction requests for relayer
     *
     * @param handler - Callback that attempts to submit the transaction on behalf of the requester
     */
    subscribeToMetaTxRequest(handler: (from: string, inbox: string, data?: MetaTxPayload<any>, err?: NxtpErrorJson) => void, _requestContext?: RequestContext): Promise<void>;
    /**
     * Publishes a response to a meta transaction submission request
     *
     * @param publishInbox - Unique inbox for the meta tx request
     * @param data - (optional) Meta transaction response information to return to requester. Not needed if submission failed
     * @param err - (optional) Error when submitting meta transaction. Not needed if submission was successful
     */
    publishMetaTxResponse(from: string, publishInbox: string, data?: MetaTxResponse, err?: NxtpErrorJson, _requestContext?: RequestContext): Promise<void>;
    /**
     * Publishes a request for a relayer to submit a transaction on behalf of the user
     *
     * @param data - The meta transaction information
     * @param inbox - (optional) The inbox for relayers to send responses to. If not provided, one will be generated
     * @returns The inbox that will receive responses
     */
    publishMetaTxRequest<T extends MetaTxType>(data: MetaTxPayload<T>, inbox?: string, _requestContext?: RequestContext): Promise<{
        inbox: string;
    }>;
    /**
     * Subscribes to the get status requests
     *
     * @param handler - Callback that attempts to get status on behalf of the requester
     */
    subscribeToStatusRequest(handler: (from: string, inbox: string, data?: any, err?: NxtpErrorJson) => void, _requestContext?: RequestContext): Promise<void>;
    publishStatusResponse(from: string, publishInbox: string, data?: StatusResponse, err?: NxtpErrorJson, _requestContext?: RequestContext): Promise<void>;
}
/**
 * @classdesc Handles NXTP messaging logic that is specific to the messages a user will need to handle.
 *
 */
export declare class UserNxtpNatsMessagingService extends NatsNxtpMessagingService {
    /**
     * Publishes an auction request to initiate the crosschain transfer process
     *
     * @param data - Auction information needed by routers to submit bid
     * @param inbox - (optional) Where routers should respond to. If not provided, will be generated
     * @returns The inbox string to expect responses at
     *
     */
    publishAuctionRequest(data: AuctionPayload, inbox?: string, _requestContext?: RequestContext): Promise<{
        inbox: string;
    }>;
    /**
     * Handles any responses by routers to a user-initiated auction
     *
     * @param inbox - Inbox where auction responses are sent
     * @param handler - Callback to be executed when an auction response is receivied
     */
    subscribeToAuctionResponse(handler: (from: string, inbox: string, data?: AuctionResponse, err?: any) => void, _requestContext?: RequestContext): Promise<void>;
    /**
     * Publishes a request for a relayer to submit a transaction on behalf of the user
     *
     * @param data - The meta transaction information
     * @param inbox - (optional) The inbox for relayers to send responses to. If not provided, one will be generated
     * @returns The inbox that will receive responses
     */
    publishMetaTxRequest<T extends MetaTxType>(data: MetaTxPayload<T>, inbox?: string, _requestContext?: RequestContext): Promise<{
        inbox: string;
    }>;
    /**
     * Handles any responses by relayers to a meta transaction submission
     *
     * @param inbox - Where relayers will be sending responses
     * @param handler - Callback to handle relayer responses
     */
    subscribeToMetaTxResponse(handler: (from: string, inbox: string, data?: MetaTxResponse, err?: any) => void, _requestContext?: RequestContext): Promise<void>;
    publishStatusRequest(data: any, inbox?: string, _requestContext?: RequestContext): Promise<{
        inbox: string;
    }>;
    subscribeToStatusResponse(handler: (from: string, inbox: string, data?: StatusResponse, err?: any) => void, _requestContext?: RequestContext): Promise<void>;
}
//# sourceMappingURL=messaging.d.ts.map