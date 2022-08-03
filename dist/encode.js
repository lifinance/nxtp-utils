"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeRouterRemoveLiquidityData = exports.encodeRouterCancelData = exports.encodeRouterFulfillData = exports.encodeRouterPrepareData = exports.SignedRouterFulfillDataEncoding = exports.FulfillDataEncoding = exports.SignedRouterPrepareDataEncoding = exports.PrepareDataEncoding = exports.decodeAuctionBid = exports.encodeAuctionBid = exports.AuctionBidEncoding = exports.encodeCancelData = exports.encodeFulfillData = exports.getVariantTransactionDigest = exports.getInvariantTransactionDigest = exports.encodeTxData = exports.SignedCancelDataEncoding = exports.SignedFulfillDataEncoding = exports.VariantTransactionDataEncoding = exports.InvariantTransactionDataEncoding = exports.TransactionDataEncoding = exports.tidy = void 0;
const utils_1 = require("ethers/lib/utils");
/**
 * Cleans any strings so they replace the newlines and properly format whitespace. Used to translate human readable encoding to contract-compatible encoding.
 *
 * @param str String to clean
 * @returns Cleaned version of the input
 */
const tidy = (str) => `${str.replace(/\n/g, "").replace(/ +/g, " ")}`;
exports.tidy = tidy;
exports.TransactionDataEncoding = (0, exports.tidy)(`tuple(
  address receivingChainTxManagerAddress,
  address user,
  address router,
  address initiator,
  address sendingAssetId,
  address receivingAssetId,
  address sendingChainFallback,
  address receivingAddress,
  address callTo,
  bytes32 callDataHash,
  bytes32 transactionId,
  uint256 sendingChainId,
  uint256 receivingChainId,
  uint256 amount,
  uint256 expiry,
  uint256 preparedBlockNumber
)`);
exports.InvariantTransactionDataEncoding = (0, exports.tidy)(`tuple(
  address receivingChainTxManagerAddress,
  address user,
  address router,
  address initiator,
  address sendingAssetId,
  address receivingAssetId,
  address sendingChainFallback,
  address receivingAddress,
  address callTo,
  uint256 sendingChainId,
  uint256 receivingChainId,
  bytes32 callDataHash,
  bytes32 transactionId
)`);
exports.VariantTransactionDataEncoding = (0, exports.tidy)(`tuple(
  uint256 amount,
  uint256 expiry,
  uint256 preparedBlockNumber
)`);
exports.SignedFulfillDataEncoding = (0, exports.tidy)(`tuple(
  bytes32 transactionId,
  uint256 relayerFee,
  string functionIdentifier,
  uint256 receivingChainId,
  address receivingChainTxManagerAddress
)`);
exports.SignedCancelDataEncoding = (0, exports.tidy)(`tuple(
  bytes32 transactionId,
  string functionIdentifier,
  uint256 receivingChainId,
  address receivingChainTxManagerAddress
)`);
/**
 * Encodes an InvariantTransactionData object
 *
 * @param txDataParams - Object to encode
 * @returns Encoded version of the params
 */
const encodeTxData = (txDataParams) => {
    return utils_1.defaultAbiCoder.encode([exports.InvariantTransactionDataEncoding], [txDataParams]);
};
exports.encodeTxData = encodeTxData;
/**
 * Hashes an InvariantTransactionData object
 *
 * @param txDataParams - Object to encode + hash
 * @returns The hash of the encoded object
 */
const getInvariantTransactionDigest = (txDataParams) => {
    const digest = (0, utils_1.keccak256)((0, exports.encodeTxData)(txDataParams));
    return digest;
};
exports.getInvariantTransactionDigest = getInvariantTransactionDigest;
/**
 * Hashes VariantTransactionData object
 *
 * @param txDataParams - Object to encode + hash
 * @returns Hash of the encoded object
 */
const getVariantTransactionDigest = (txDataParams) => {
    const digest = (0, utils_1.keccak256)(utils_1.defaultAbiCoder.encode([exports.VariantTransactionDataEncoding], [txDataParams]));
    return digest;
};
exports.getVariantTransactionDigest = getVariantTransactionDigest;
/**
 * Encodes a fulfill payload object, as defined in the TransactionManager contract
 *
 * @param transactionId - Unique identifier to encode
 * @param relayerFee - Fee to encode
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @returns Encoded fulfill payload
 */
const encodeFulfillData = (transactionId, relayerFee, receivingChainId, receivingChainTxManagerAddress) => {
    return utils_1.defaultAbiCoder.encode([exports.SignedFulfillDataEncoding], [{ transactionId, relayerFee, functionIdentifier: "fulfill", receivingChainId, receivingChainTxManagerAddress }]);
};
exports.encodeFulfillData = encodeFulfillData;
/**
 * Encode a cancel payload object, as defined in the TransactionManager contract
 *
 * @param transactionId - Unique identifier to encode
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @returns  Encoded cancel payload
 */
const encodeCancelData = (transactionId, receivingChainId, receivingChainTxManagerAddress) => {
    return utils_1.defaultAbiCoder.encode([exports.SignedCancelDataEncoding], [{ transactionId, functionIdentifier: "cancel", receivingChainId, receivingChainTxManagerAddress }]);
};
exports.encodeCancelData = encodeCancelData;
////// AUCTION
exports.AuctionBidEncoding = (0, exports.tidy)(`tuple(
  address user,
  address router,
  address initiator,
  uint256 sendingChainId,
  address sendingAssetId,
  uint256 amount,
  uint256 receivingChainId,
  address receivingAssetId,
  uint256 amountReceived,
  address receivingAddress,
  bytes32 transactionId,
  uint256 expiry,
  bytes32 callDataHash,
  address callTo,
  bytes encryptedCallData,
  address sendingChainTxManagerAddress,
  address receivingChainTxManagerAddress,
  uint256 bidExpiry
)`);
/**
 * Encodes a bid on a crosschain transaction auction
 *
 * @param bid - Bid to encode
 * @returns Encoded bid
 */
const encodeAuctionBid = (bid) => {
    return utils_1.defaultAbiCoder.encode([exports.AuctionBidEncoding], [bid]);
};
exports.encodeAuctionBid = encodeAuctionBid;
/**
 * Decode bid
 * @param data - Data to decode
 * @returns Decoded bid
 */
const decodeAuctionBid = (data) => {
    const [decoded] = utils_1.defaultAbiCoder.decode([exports.AuctionBidEncoding], data);
    return {
        user: decoded.user,
        router: decoded.router,
        initiator: decoded.initiator,
        sendingAssetId: decoded.sendingAssetId,
        sendingChainId: decoded.sendingChainId,
        amount: decoded.amount.toString(),
        receivingAssetId: decoded.receivingAssetId,
        receivingChainId: decoded.receivingChainId,
        receivingAddress: decoded.receivingAddress,
        amountReceived: decoded.amountReceived.toString(),
        transactionId: decoded.transactionId,
        callDataHash: decoded.callDataHash,
        encryptedCallData: decoded.encryptedCallData,
        callTo: decoded.callTo,
        bidExpiry: decoded.bidExpiry.toNumber(),
        expiry: decoded.expiry.toNumber(),
        receivingChainTxManagerAddress: decoded.receivingChainTxManagerAddress,
        sendingChainTxManagerAddress: decoded.sendingChainTxManagerAddress,
    };
};
exports.decodeAuctionBid = decodeAuctionBid;
// For Router.sol
/**
 * Encoding for a Router.sol prepare call
 */
exports.PrepareDataEncoding = (0, exports.tidy)(`tuple(
  ${exports.InvariantTransactionDataEncoding} invariantData,
  uint256 amount,
  uint256 expiry,
  bytes encryptedCallData,
  bytes encodedBid,
  bytes bidSignature,
  bytes encodedMeta
  )`);
exports.SignedRouterPrepareDataEncoding = (0, exports.tidy)(`tuple(
  ${exports.PrepareDataEncoding} args,
  address routerRelayerFeeAsset,
  uint256 routerRelayerFee,
  uint256 chainId)
  `);
exports.FulfillDataEncoding = (0, exports.tidy)(`tuple(
  ${exports.TransactionDataEncoding} txData,
  uint256 relayerFee,
  bytes signature,
  bytes callData,
  bytes encodedMeta
  )`);
exports.SignedRouterFulfillDataEncoding = (0, exports.tidy)(`tuple(
  ${exports.FulfillDataEncoding} args,
  address routerRelayerFeeAsset,
  uint256 routerRelayerFee,
  uint256 chainId
  )`);
const CancelDataEncoding = (0, exports.tidy)(`tuple(
  ${exports.TransactionDataEncoding} txData,
  bytes signature,
  bytes encodedMeta
  )`);
const SignedRouterCancelDataEncoding = (0, exports.tidy)(`tuple(
  ${CancelDataEncoding} args,
  address routerRelayerFeeAsset,
  uint256 routerRelayerFee,
  uint256 chainId
  )`);
const SignedRouterRemoveLiquidityDataEncoding = (0, exports.tidy)(`tuple(
  uint256 amount,
  address assetId,
  address routerRelayerFeeAsset,
  uint256 routerRelayerFee,
  uint256 chainId
)`);
/**
 * Encodes data for prepare function
 * @param invariantData
 * @param amount
 * @param expiry
 * @param encryptedCallData
 * @param encodedBid
 * @param bidSignature
 * @param encodedMeta
 * @returns
 */
const encodeRouterPrepareData = (invariantData, amount, expiry, encryptedCallData, encodedBid, bidSignature, encodedMeta, routerRelayerFeeAsset, routerRelayerFee, chainId) => {
    return utils_1.defaultAbiCoder.encode([exports.SignedRouterPrepareDataEncoding], [
        {
            args: {
                invariantData,
                amount,
                expiry,
                encryptedCallData,
                encodedBid,
                bidSignature,
                encodedMeta,
            },
            routerRelayerFeeAsset,
            routerRelayerFee,
            chainId,
        },
    ]);
};
exports.encodeRouterPrepareData = encodeRouterPrepareData;
const encodeRouterFulfillData = (txData, fulfillSignature, fulfillRelayerFee, callData, encodedMeta, routerRelayerFeeAsset, routerRelayerFee, chainId) => {
    return utils_1.defaultAbiCoder.encode([exports.SignedRouterFulfillDataEncoding], [
        {
            args: {
                txData,
                relayerFee: fulfillRelayerFee,
                signature: fulfillSignature,
                callData,
                encodedMeta,
            },
            routerRelayerFeeAsset,
            routerRelayerFee,
            chainId,
        },
    ]);
};
exports.encodeRouterFulfillData = encodeRouterFulfillData;
const encodeRouterCancelData = (txData, cancelSignature, encodedMeta, routerRelayerFeeAsset, routerRelayerFee, chainId) => {
    return utils_1.defaultAbiCoder.encode([SignedRouterCancelDataEncoding], [
        {
            args: {
                txData,
                signature: cancelSignature,
                encodedMeta,
            },
            routerRelayerFeeAsset,
            routerRelayerFee,
            chainId,
        },
    ]);
};
exports.encodeRouterCancelData = encodeRouterCancelData;
const encodeRouterRemoveLiquidityData = (amount, assetId, routerRelayerFeeAsset, routerRelayerFee, chainId) => {
    return utils_1.defaultAbiCoder.encode([SignedRouterRemoveLiquidityDataEncoding], [{ amount, assetId, routerRelayerFeeAsset, routerRelayerFee, chainId }]);
};
exports.encodeRouterRemoveLiquidityData = encodeRouterRemoveLiquidityData;
//# sourceMappingURL=encode.js.map