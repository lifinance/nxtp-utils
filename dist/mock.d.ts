import { providers } from "ethers";
import { InvariantTransactionData, VariantTransactionData, TransactionData, TransactionPreparedEvent, TransactionFulfilledEvent, AuctionBid, RequestContext, PrepareParams, FulfillParams, CancelParams } from "./index";
export declare const txReceiptMock: providers.TransactionReceipt;
export declare const invariantDataMock: InvariantTransactionData;
export declare const variantDataMock: VariantTransactionData;
export declare const auctionBidMock: AuctionBid;
export declare const txDataMock: TransactionData;
export declare const transactionSubgraphMock: any;
export declare const senderPrepareDataMock: TransactionPreparedEvent;
export declare const receiverFulfillDataMock: TransactionFulfilledEvent;
export declare const requestContextMock: RequestContext;
export declare const prepareParamsMock: PrepareParams;
export declare const fulfillParamsMock: FulfillParams;
export declare const cancelParamsMock: CancelParams;
export declare const sigMock = "0xabcdef1c";
//# sourceMappingURL=mock.d.ts.map