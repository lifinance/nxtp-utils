"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sigMock = exports.cancelParamsMock = exports.fulfillParamsMock = exports.prepareParamsMock = exports.requestContextMock = exports.receiverFulfillDataMock = exports.senderPrepareDataMock = exports.transactionSubgraphMock = exports.txDataMock = exports.auctionBidMock = exports.variantDataMock = exports.invariantDataMock = exports.txReceiptMock = void 0;
const ethers_1 = require("ethers");
const index_1 = require("./index");
exports.txReceiptMock = {
    blockHash: "foo",
    blockNumber: 1,
    byzantium: true,
    confirmations: 5,
    contractAddress: (0, index_1.mkAddress)(),
    cumulativeGasUsed: ethers_1.constants.One,
    from: (0, index_1.mkAddress)(),
    transactionHash: (0, index_1.mkBytes32)(),
    effectiveGasPrice: ethers_1.BigNumber.from(10),
    gasUsed: ethers_1.constants.One,
    to: (0, index_1.mkAddress)(),
    logs: [],
    logsBloom: "",
    transactionIndex: 1,
};
exports.invariantDataMock = {
    receivingChainTxManagerAddress: (0, index_1.mkAddress)("0xbb"),
    user: (0, index_1.mkAddress)("0xa"),
    router: (0, index_1.mkAddress)("0xb"),
    initiator: (0, index_1.mkAddress)("0xbb"),
    sendingAssetId: (0, index_1.mkAddress)("0xc"),
    receivingAssetId: (0, index_1.mkAddress)("0xd"),
    sendingChainFallback: (0, index_1.mkAddress)("0xe"),
    receivingAddress: (0, index_1.mkAddress)("0xf"),
    callTo: (0, index_1.mkAddress)("0xaa"),
    sendingChainId: 1337,
    receivingChainId: 1338,
    callDataHash: (0, index_1.mkBytes32)("0xa"),
    transactionId: (0, index_1.mkBytes32)("0xb"),
};
exports.variantDataMock = {
    amount: "1000000",
    expiry: Math.floor(Date.now() / 1000) + 24 * 3600 * 3,
    preparedBlockNumber: 1234,
};
exports.auctionBidMock = {
    user: exports.invariantDataMock.user,
    router: exports.invariantDataMock.router,
    initiator: exports.invariantDataMock.initiator,
    sendingAssetId: exports.invariantDataMock.sendingAssetId,
    receivingAssetId: exports.invariantDataMock.receivingAssetId,
    receivingAddress: exports.invariantDataMock.receivingAddress,
    sendingChainId: exports.invariantDataMock.sendingChainId,
    receivingChainId: exports.invariantDataMock.receivingChainId,
    callTo: exports.invariantDataMock.callTo,
    callDataHash: exports.invariantDataMock.callDataHash,
    transactionId: exports.invariantDataMock.transactionId,
    amount: exports.variantDataMock.amount,
    sendingChainTxManagerAddress: (0, index_1.mkAddress)("0x1"),
    receivingChainTxManagerAddress: (0, index_1.mkAddress)("0x2"),
    expiry: exports.variantDataMock.expiry,
    encryptedCallData: "0x",
    amountReceived: "120",
    bidExpiry: 123457,
};
exports.txDataMock = {
    ...exports.invariantDataMock,
    ...exports.variantDataMock,
};
exports.transactionSubgraphMock = {
    user: { id: exports.txDataMock.user },
    router: { id: exports.txDataMock.router },
    initiator: exports.txDataMock.initiator,
    receivingChainTxManagerAddress: exports.txDataMock.receivingChainTxManagerAddress,
    sendingChainId: exports.txDataMock.sendingChainId,
    sendingAssetId: exports.txDataMock.sendingAssetId,
    sendingChainFallback: exports.txDataMock.sendingChainFallback,
    amount: exports.txDataMock.amount,
    receivingChainId: exports.txDataMock.receivingChainId,
    receivingAssetId: exports.txDataMock.receivingAssetId,
    receivingAddress: exports.txDataMock.receivingAddress,
    expiry: exports.txDataMock.expiry,
    callDataHash: exports.txDataMock.callDataHash,
    callTo: exports.txDataMock.callTo,
    transactionId: exports.txDataMock.transactionId,
    preparedBlockNumber: exports.txDataMock.preparedBlockNumber,
};
exports.senderPrepareDataMock = {
    txData: exports.txDataMock,
    caller: (0, index_1.mkAddress)("0xf"),
    encryptedCallData: (0, index_1.mkSig)("0xabc"),
    encodedBid: (0, index_1.encodeAuctionBid)(exports.auctionBidMock),
    bidSignature: (0, index_1.mkSig)("0xeee"),
};
exports.receiverFulfillDataMock = {
    txData: exports.txDataMock,
    caller: (0, index_1.mkAddress)("0xf"),
    relayerFee: "5678",
    callData: "0x",
    signature: (0, index_1.mkSig)("0xeee"),
};
exports.requestContextMock = {
    id: "0xf",
    origin: "0xe",
};
exports.prepareParamsMock = {
    txData: exports.txDataMock,
    amount: "123",
    expiry: 123456,
    encryptedCallData: (0, index_1.mkSig)("0xabc"),
    encodedBid: (0, index_1.encodeAuctionBid)(exports.auctionBidMock),
    bidSignature: (0, index_1.mkSig)("0xeee"),
};
exports.fulfillParamsMock = {
    txData: exports.txDataMock,
    relayerFee: "5678",
    signature: (0, index_1.mkSig)("0xeee"),
    callData: "0x",
};
exports.cancelParamsMock = {
    txData: exports.txDataMock,
    signature: (0, index_1.mkSig)("0xeee"),
};
exports.sigMock = "0xabcdef1c";
//# sourceMappingURL=mock.js.map