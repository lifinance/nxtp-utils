"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRouterRemoveLiquidityTransactionPayload = exports.signRouterCancelTransactionPayload = exports.signRouterFulfillTransactionPayload = exports.signRouterPrepareTransactionPayload = exports.recoverAuctionBid = exports.signAuctionBid = exports.recoverCancelTransactionPayload = exports.signCancelTransactionPayload = exports.recoverFulfilledTransactionPayload = exports.getFulfillTransactionHashToSign = exports.signFulfillTransactionPayload = exports.sign = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const encode_1 = require("./encode");
/**
 * Occasionally have seen metamask return signatures with v = 00 or v = 01.
 * Signatures having these values will revert when used onchain. Ethers handles
 * these cases in the `splitSignature` function, where it regenerates an
 * appropriate `v` value:
 * https://github.com/ethers-io/ethers.js/blob/c2c0ce75039e7256b287f9a764188d08ed0b7296/packages/bytes/src.ts/index.ts#L348-L355
 *
 * This function will rely on the edgecase handling there to ensure any
 * signatures are properly formatted. This has been tested manually against
 * offending signatures.
 *
 * @param sig Signature to sanitize
 */
const sanitizeSignature = (sig) => {
    if (sig.endsWith("1c") || sig.endsWith("1b")) {
        return sig;
    }
    // Must be sanitized
    const { v } = (0, utils_1.splitSignature)(sig);
    const hex = ethers_1.BigNumber.from(v).toHexString();
    return sig.slice(0, sig.length - 2) + hex.slice(2);
};
const sign = async (hash, signer) => {
    var _a;
    const msg = (0, utils_1.arrayify)(hash);
    const addr = await signer.getAddress();
    if (typeof ((_a = signer.provider) === null || _a === void 0 ? void 0 : _a.send) === "function") {
        try {
            return sanitizeSignature(await signer.provider.send("personal_sign", [hash, addr]));
        }
        catch (err) {
            // console.error("Error using personal_sign, falling back to signer.signMessage: ", err);
        }
    }
    return sanitizeSignature(await signer.signMessage(msg));
};
exports.sign = sign;
/**
 * Generates a signature on an fulfill transaction payload
 *
 * @param transactionId - Transaction ID that was signed
 * @param relayerFee - Relayer fee that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @param signature - Signature to recover signer of
 * @returns Signature of the payload from the signer
 */
const signFulfillTransactionPayload = async (transactionId, relayerFee, receivingChainId, receivingChainTxManagerAddress, signer) => {
    const hash = (0, exports.getFulfillTransactionHashToSign)(transactionId, relayerFee, receivingChainId, receivingChainTxManagerAddress);
    return (0, exports.sign)(hash, signer);
};
exports.signFulfillTransactionPayload = signFulfillTransactionPayload;
/**
 * Generates a hash to sign of an fulfill transaction payload
 *
 * @param transactionId - Transaction ID that was signed
 * @param relayerFee - Relayer fee that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @returns Hash that should be signed
 */
const getFulfillTransactionHashToSign = (transactionId, relayerFee, receivingChainId, receivingChainTxManagerAddress) => {
    const payload = (0, encode_1.encodeFulfillData)(transactionId, relayerFee, receivingChainId, receivingChainTxManagerAddress);
    const hash = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return hash;
};
exports.getFulfillTransactionHashToSign = getFulfillTransactionHashToSign;
/**
 * Returns the recovered signer from the fulfilled transaction
 *
 * @param transactionId - Transaction ID that was signed
 * @param relayerFee - Relayer fee that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @param signature - Signature to recover signer of
 * @returns Recovered address of signer
 */
const recoverFulfilledTransactionPayload = (transactionId, relayerFee, receivingChainId, receivingChainTxManagerAddress, signature) => {
    const payload = (0, encode_1.encodeFulfillData)(transactionId, relayerFee, receivingChainId, receivingChainTxManagerAddress);
    const hashed = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, utils_1.verifyMessage)((0, utils_1.arrayify)(hashed), signature);
};
exports.recoverFulfilledTransactionPayload = recoverFulfilledTransactionPayload;
/**
 * Generates a signature on an cancel transaction payload
 *
 * @param transactionId - Transaction ID that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @param signature - Signature to recover signer of
 * @returns Signature of the payload from the signer
 */
const signCancelTransactionPayload = async (transactionId, receivingChainId, receivingChainTxManagerAddress, signer) => {
    const payload = (0, encode_1.encodeCancelData)(transactionId, receivingChainId, receivingChainTxManagerAddress);
    const hash = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, exports.sign)(hash, signer);
};
exports.signCancelTransactionPayload = signCancelTransactionPayload;
/**
 * Returns the recovered signer from the cancelled transaction
 *
 * @param transactionId - Transaction ID that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @param signature - Signature to recover signer of
 * @returns Recovered address of signer
 */
const recoverCancelTransactionPayload = (transactionId, receivingChainId, receivingChainTxManagerAddress, signature) => {
    const payload = (0, encode_1.encodeCancelData)(transactionId, receivingChainId, receivingChainTxManagerAddress);
    const hashed = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, utils_1.verifyMessage)((0, utils_1.arrayify)(hashed), signature);
};
exports.recoverCancelTransactionPayload = recoverCancelTransactionPayload;
/**
 * Generates a signature on an auction bid
 *
 * @param bid - Bid to sign
 * @param signer - Account signing the bid
 * @returns Signature of the bid from the signer
 */
const signAuctionBid = async (bid, signer) => {
    const payload = (0, encode_1.encodeAuctionBid)(bid);
    const hashed = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return sanitizeSignature(await signer.signMessage((0, utils_1.arrayify)(hashed)));
};
exports.signAuctionBid = signAuctionBid;
/**
 * Recovers the signer of a given auction bid
 *
 * @param bid - Bid information that should've been signed
 * @param signature - Signature to recover signer of
 * @returns Recovered signer
 */
const recoverAuctionBid = (bid, signature) => {
    const payload = (0, encode_1.encodeAuctionBid)(bid);
    const hashed = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, utils_1.verifyMessage)((0, utils_1.arrayify)(hashed), signature);
};
exports.recoverAuctionBid = recoverAuctionBid;
// Router.sol
const signRouterPrepareTransactionPayload = async (invariantData, amount, expiry, encryptedCallData, encodedBid, bidSignature, encodedMeta, relayerFeeAsset, relayerFee, chainId, signer) => {
    const payload = (0, encode_1.encodeRouterPrepareData)(invariantData, amount, expiry, encryptedCallData, encodedBid, bidSignature, encodedMeta, relayerFeeAsset, relayerFee, chainId);
    const hash = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, exports.sign)(hash, signer);
};
exports.signRouterPrepareTransactionPayload = signRouterPrepareTransactionPayload;
const signRouterFulfillTransactionPayload = async (txData, fulfillSignature, fulfillRelayerFee, callData, encodedMeta, relayerFeeAsset, relayerFee, chainId, signer) => {
    const payload = (0, encode_1.encodeRouterFulfillData)(txData, fulfillSignature, fulfillRelayerFee, callData, encodedMeta, relayerFeeAsset, relayerFee, chainId);
    const hash = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, exports.sign)(hash, signer);
};
exports.signRouterFulfillTransactionPayload = signRouterFulfillTransactionPayload;
const signRouterCancelTransactionPayload = async (txData, cancelSignature, encodedMeta, relayerFeeAsset, relayerFee, chainId, signer) => {
    const payload = (0, encode_1.encodeRouterCancelData)(txData, cancelSignature, encodedMeta, relayerFeeAsset, relayerFee, chainId);
    const hash = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, exports.sign)(hash, signer);
};
exports.signRouterCancelTransactionPayload = signRouterCancelTransactionPayload;
const signRouterRemoveLiquidityTransactionPayload = (amount, assetId, relayerFeeAsset, relayerFee, chainId, signer) => {
    const payload = (0, encode_1.encodeRouterRemoveLiquidityData)(amount, assetId, relayerFeeAsset, relayerFee, chainId);
    const hash = (0, utils_1.solidityKeccak256)(["bytes"], [payload]);
    return (0, exports.sign)(hash, signer);
};
exports.signRouterRemoveLiquidityTransactionPayload = signRouterRemoveLiquidityTransactionPayload;
//# sourceMappingURL=signatures.js.map