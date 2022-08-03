import { Signer, Wallet } from "ethers";
import { AuctionBid } from "./messaging";
import { InvariantTransactionData, TransactionData } from "./transactionManager";
export declare const sign: (hash: string, signer: Wallet | Signer) => Promise<string>;
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
export declare const signFulfillTransactionPayload: (transactionId: string, relayerFee: string, receivingChainId: number, receivingChainTxManagerAddress: string, signer: Wallet | Signer) => Promise<string>;
/**
 * Generates a hash to sign of an fulfill transaction payload
 *
 * @param transactionId - Transaction ID that was signed
 * @param relayerFee - Relayer fee that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @returns Hash that should be signed
 */
export declare const getFulfillTransactionHashToSign: (transactionId: string, relayerFee: string, receivingChainId: number, receivingChainTxManagerAddress: string) => string;
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
export declare const recoverFulfilledTransactionPayload: (transactionId: string, relayerFee: string, receivingChainId: number, receivingChainTxManagerAddress: string, signature: string) => string;
/**
 * Generates a signature on an cancel transaction payload
 *
 * @param transactionId - Transaction ID that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @param signature - Signature to recover signer of
 * @returns Signature of the payload from the signer
 */
export declare const signCancelTransactionPayload: (transactionId: string, receivingChainId: number, receivingChainTxManagerAddress: string, signer: Signer) => Promise<string>;
/**
 * Returns the recovered signer from the cancelled transaction
 *
 * @param transactionId - Transaction ID that was signed
 * @param receivingChainId - Chain id for receiving chain
 * @param receivingChainTxManagerAddress - Address of `TransactionManager.sol` on the receiving chain
 * @param signature - Signature to recover signer of
 * @returns Recovered address of signer
 */
export declare const recoverCancelTransactionPayload: (transactionId: string, receivingChainId: number, receivingChainTxManagerAddress: string, signature: string) => string;
/**
 * Generates a signature on an auction bid
 *
 * @param bid - Bid to sign
 * @param signer - Account signing the bid
 * @returns Signature of the bid from the signer
 */
export declare const signAuctionBid: (bid: AuctionBid, signer: Signer) => Promise<string>;
/**
 * Recovers the signer of a given auction bid
 *
 * @param bid - Bid information that should've been signed
 * @param signature - Signature to recover signer of
 * @returns Recovered signer
 */
export declare const recoverAuctionBid: (bid: AuctionBid, signature: string) => string;
export declare const signRouterPrepareTransactionPayload: (invariantData: InvariantTransactionData, amount: string, expiry: number, encryptedCallData: string, encodedBid: string, bidSignature: string, encodedMeta: string, relayerFeeAsset: string, relayerFee: string, chainId: number, signer: Wallet | Signer) => Promise<string>;
export declare const signRouterFulfillTransactionPayload: (txData: TransactionData, fulfillSignature: string, fulfillRelayerFee: string, callData: string, encodedMeta: string, relayerFeeAsset: string, relayerFee: string, chainId: number, signer: Wallet | Signer) => Promise<string>;
export declare const signRouterCancelTransactionPayload: (txData: TransactionData, cancelSignature: string, encodedMeta: string, relayerFeeAsset: string, relayerFee: string, chainId: number, signer: Wallet | Signer) => Promise<string>;
export declare const signRouterRemoveLiquidityTransactionPayload: (amount: string, assetId: string, relayerFeeAsset: string, relayerFee: string, chainId: number, signer: Wallet | Signer) => Promise<string>;
//# sourceMappingURL=signatures.d.ts.map