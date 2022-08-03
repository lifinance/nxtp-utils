"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionPreparedEventSchema = exports.SignedFulfillDataSchema = exports.CrosschainTransactionSchema = exports.SignedCancelDataSchema = exports.TransactionDataSchema = exports.VariantTransactionDataSchema = exports.InvariantTransactionDataSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const basic_1 = require("./basic");
// Used to include *all* info for both sending and receiving crosschain data
exports.InvariantTransactionDataSchema = typebox_1.Type.Object({
    receivingChainTxManagerAddress: basic_1.TAddress,
    user: basic_1.TAddress,
    router: basic_1.TAddress,
    initiator: basic_1.TAddress,
    sendingAssetId: basic_1.TAddress,
    receivingAssetId: basic_1.TAddress,
    sendingChainFallback: basic_1.TAddress,
    callTo: basic_1.TAddress,
    receivingAddress: basic_1.TAddress,
    sendingChainId: basic_1.TChainId,
    receivingChainId: basic_1.TChainId,
    callDataHash: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
    transactionId: typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
});
exports.VariantTransactionDataSchema = typebox_1.Type.Object({
    amount: basic_1.TIntegerString,
    expiry: typebox_1.Type.Number(),
    preparedBlockNumber: typebox_1.Type.Number(),
});
exports.TransactionDataSchema = typebox_1.Type.Intersect([exports.InvariantTransactionDataSchema, exports.VariantTransactionDataSchema]);
exports.SignedCancelDataSchema = typebox_1.Type.Object({
    invariantDigest: typebox_1.Type.String(),
    relayerFee: basic_1.TIntegerString,
    cancel: typebox_1.Type.RegEx(/cancel/), // just the string "cancel"
});
exports.CrosschainTransactionSchema = typebox_1.Type.Object({
    invariant: exports.InvariantTransactionDataSchema,
    sending: exports.VariantTransactionDataSchema,
    receiving: typebox_1.Type.Optional(exports.VariantTransactionDataSchema),
});
exports.SignedFulfillDataSchema = typebox_1.Type.Object({
    invariantDigest: typebox_1.Type.String(),
    relayerFee: basic_1.TIntegerString,
});
// Events
exports.TransactionPreparedEventSchema = typebox_1.Type.Object({
    txData: exports.TransactionDataSchema,
    caller: typebox_1.Type.Optional(basic_1.TAddress),
    encryptedCallData: typebox_1.Type.String(),
    encodedBid: typebox_1.Type.String(),
    bidSignature: typebox_1.Type.String(),
});
//# sourceMappingURL=transactionManager.js.map