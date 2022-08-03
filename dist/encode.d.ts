import { AuctionBid } from "./messaging";
import { InvariantTransactionData, TransactionData, VariantTransactionData } from "./transactionManager";
/**
 * Cleans any strings so they replace the newlines and properly format whitespace. Used to translate human readable encoding to contract-compatible encoding.
 *
 * @param str String to clean
 * @returns Cleaned version of the input
 */
export declare const tidy: (str: string) => string;
export declare const TransactionDataEncoding: string;
export declare const InvariantTransactionDataEncoding: string;
export declare const VariantTransactionDataEncoding: string;
export declare const SignedFulfillDataEncoding: string;
export declare const SignedCancelDataEncoding: string;
/**
 * Encodes an InvariantTransactionData object
 *
 * @param txDataParams - Object to encode
 * @returns Encoded version of the params
 */
export declare const encodeTxData: (txDataParams: InvariantTransactionData) => string;
/**
 * Hashes an InvariantTransactionData object
 *
 * @param txDataParams - Object to encode + hash
 * @returns The hash of the encoded object
 */
export declare const getInvariantTransactionDigest: (txDataParams: InvariantTransactionData) => string;
/**
 * Hashes VariantTransactionData object
 *
 * @param txDataParams - Object to encode + hash
 * @returns Hash of the encoded object
 */
export declare const getVariantTransactionDigest: (txDataParams: VariantTransactionData) => string;
/**
 * Encodes a fulfill payload object, as defined in the TransactionManager contract
 *
 * @param transactionId - Unique identifier to encode
 * @param relayerFee - Fee to encode
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @returns Encoded fulfill payload
 */
export declare const encodeFulfillData: (transactionId: string, relayerFee: string, receivingChainId: number, receivingChainTxManagerAddress: string) => string;
/**
 * Encode a cancel payload object, as defined in the TransactionManager contract
 *
 * @param transactionId - Unique identifier to encode
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @returns  Encoded cancel payload
 */
export declare const encodeCancelData: (transactionId: string, receivingChainId: number, receivingChainTxManagerAddress: string) => string;
export declare const AuctionBidEncoding: string;
/**
 * Encodes a bid on a crosschain transaction auction
 *
 * @param bid - Bid to encode
 * @returns Encoded bid
 */
export declare const encodeAuctionBid: (bid: AuctionBid) => string;
/**
 * Decode bid
 * @param data - Data to decode
 * @returns Decoded bid
 */
export declare const decodeAuctionBid: (data: string) => AuctionBid;
/**
 * Encoding for a Router.sol prepare call
 */
export declare const PrepareDataEncoding: string;
export declare const SignedRouterPrepareDataEncoding: string;
export declare const FulfillDataEncoding: string;
export declare const SignedRouterFulfillDataEncoding: string;
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
export declare const encodeRouterPrepareData: (invariantData: InvariantTransactionData, amount: string, expiry: number, encryptedCallData: string, encodedBid: string, bidSignature: string, encodedMeta: string, routerRelayerFeeAsset: string, routerRelayerFee: string, chainId: number) => string;
export declare const encodeRouterFulfillData: (txData: TransactionData, fulfillSignature: string, fulfillRelayerFee: string, callData: string, encodedMeta: string, routerRelayerFeeAsset: string, routerRelayerFee: string, chainId: number) => string;
export declare const encodeRouterCancelData: (txData: TransactionData, cancelSignature: string, encodedMeta: string, routerRelayerFeeAsset: string, routerRelayerFee: string, chainId: number) => string;
export declare const encodeRouterRemoveLiquidityData: (amount: string, assetId: string, routerRelayerFeeAsset: string, routerRelayerFee: string, chainId: number) => string;
//# sourceMappingURL=encode.d.ts.map