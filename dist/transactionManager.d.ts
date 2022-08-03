import { Static } from "@sinclair/typebox";
export declare const InvariantTransactionDataSchema: import("@sinclair/typebox").TObject<{
    receivingChainTxManagerAddress: import("@sinclair/typebox").TString;
    user: import("@sinclair/typebox").TString;
    router: import("@sinclair/typebox").TString;
    initiator: import("@sinclair/typebox").TString;
    sendingAssetId: import("@sinclair/typebox").TString;
    receivingAssetId: import("@sinclair/typebox").TString;
    sendingChainFallback: import("@sinclair/typebox").TString;
    callTo: import("@sinclair/typebox").TString;
    receivingAddress: import("@sinclair/typebox").TString;
    sendingChainId: import("@sinclair/typebox").TNumber;
    receivingChainId: import("@sinclair/typebox").TNumber;
    callDataHash: import("@sinclair/typebox").TString;
    transactionId: import("@sinclair/typebox").TString;
}>;
export declare type InvariantTransactionData = Static<typeof InvariantTransactionDataSchema>;
export declare const VariantTransactionDataSchema: import("@sinclair/typebox").TObject<{
    amount: import("@sinclair/typebox").TString;
    expiry: import("@sinclair/typebox").TNumber;
    preparedBlockNumber: import("@sinclair/typebox").TNumber;
}>;
export declare type VariantTransactionData = Static<typeof VariantTransactionDataSchema>;
export declare const TransactionDataSchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    receivingChainTxManagerAddress: import("@sinclair/typebox").TString;
    user: import("@sinclair/typebox").TString;
    router: import("@sinclair/typebox").TString;
    initiator: import("@sinclair/typebox").TString;
    sendingAssetId: import("@sinclair/typebox").TString;
    receivingAssetId: import("@sinclair/typebox").TString;
    sendingChainFallback: import("@sinclair/typebox").TString;
    callTo: import("@sinclair/typebox").TString;
    receivingAddress: import("@sinclair/typebox").TString;
    sendingChainId: import("@sinclair/typebox").TNumber;
    receivingChainId: import("@sinclair/typebox").TNumber;
    callDataHash: import("@sinclair/typebox").TString;
    transactionId: import("@sinclair/typebox").TString;
}>, import("@sinclair/typebox").TObject<{
    amount: import("@sinclair/typebox").TString;
    expiry: import("@sinclair/typebox").TNumber;
    preparedBlockNumber: import("@sinclair/typebox").TNumber;
}>]>;
export declare type TransactionData = Static<typeof TransactionDataSchema>;
export declare const SignedCancelDataSchema: import("@sinclair/typebox").TObject<{
    invariantDigest: import("@sinclair/typebox").TString;
    relayerFee: import("@sinclair/typebox").TString;
    cancel: import("@sinclair/typebox").TString;
}>;
export declare const CrosschainTransactionSchema: import("@sinclair/typebox").TObject<{
    invariant: import("@sinclair/typebox").TObject<{
        receivingChainTxManagerAddress: import("@sinclair/typebox").TString;
        user: import("@sinclair/typebox").TString;
        router: import("@sinclair/typebox").TString;
        initiator: import("@sinclair/typebox").TString;
        sendingAssetId: import("@sinclair/typebox").TString;
        receivingAssetId: import("@sinclair/typebox").TString;
        sendingChainFallback: import("@sinclair/typebox").TString;
        callTo: import("@sinclair/typebox").TString;
        receivingAddress: import("@sinclair/typebox").TString;
        sendingChainId: import("@sinclair/typebox").TNumber;
        receivingChainId: import("@sinclair/typebox").TNumber;
        callDataHash: import("@sinclair/typebox").TString;
        transactionId: import("@sinclair/typebox").TString;
    }>;
    sending: import("@sinclair/typebox").TObject<{
        amount: import("@sinclair/typebox").TString;
        expiry: import("@sinclair/typebox").TNumber;
        preparedBlockNumber: import("@sinclair/typebox").TNumber;
    }>;
    receiving: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        amount: import("@sinclair/typebox").TString;
        expiry: import("@sinclair/typebox").TNumber;
        preparedBlockNumber: import("@sinclair/typebox").TNumber;
    }>>;
}>;
export declare type CrosschainTransaction = Static<typeof CrosschainTransactionSchema>;
export declare type SignedCancelData = Static<typeof SignedCancelDataSchema>;
export declare const SignedFulfillDataSchema: import("@sinclair/typebox").TObject<{
    invariantDigest: import("@sinclair/typebox").TString;
    relayerFee: import("@sinclair/typebox").TString;
}>;
export declare type SignedFulfillData = Static<typeof SignedFulfillDataSchema>;
export declare type PrepareParams = {
    txData: InvariantTransactionData;
    amount: string;
    expiry: number;
    encryptedCallData: string;
    encodedBid: string;
    bidSignature: string;
};
export declare type FulfillParams = {
    txData: TransactionData;
    relayerFee: string;
    signature: string;
    callData: string;
};
export declare type CancelParams = {
    txData: TransactionData;
    signature: string;
};
export declare type RemoveLiquidityParams = {
    router: string;
    assetId: string;
    amount: string;
    recipient: string;
};
export declare const TransactionPreparedEventSchema: import("@sinclair/typebox").TObject<{
    txData: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        receivingChainTxManagerAddress: import("@sinclair/typebox").TString;
        user: import("@sinclair/typebox").TString;
        router: import("@sinclair/typebox").TString;
        initiator: import("@sinclair/typebox").TString;
        sendingAssetId: import("@sinclair/typebox").TString;
        receivingAssetId: import("@sinclair/typebox").TString;
        sendingChainFallback: import("@sinclair/typebox").TString;
        callTo: import("@sinclair/typebox").TString;
        receivingAddress: import("@sinclair/typebox").TString;
        sendingChainId: import("@sinclair/typebox").TNumber;
        receivingChainId: import("@sinclair/typebox").TNumber;
        callDataHash: import("@sinclair/typebox").TString;
        transactionId: import("@sinclair/typebox").TString;
    }>, import("@sinclair/typebox").TObject<{
        amount: import("@sinclair/typebox").TString;
        expiry: import("@sinclair/typebox").TNumber;
        preparedBlockNumber: import("@sinclair/typebox").TNumber;
    }>]>;
    caller: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    encryptedCallData: import("@sinclair/typebox").TString;
    encodedBid: import("@sinclair/typebox").TString;
    bidSignature: import("@sinclair/typebox").TString;
}>;
export declare type TransactionPreparedEvent = Static<typeof TransactionPreparedEventSchema>;
export declare type TransactionFulfilledEvent = {
    txData: TransactionData;
    signature: string;
    relayerFee: string;
    callData: string;
    caller: string;
};
export declare type TransactionCancelledEvent = {
    txData: TransactionData;
    caller: string;
};
//# sourceMappingURL=transactionManager.d.ts.map