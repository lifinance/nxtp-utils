import { BigNumber } from "ethers";
import { Interface } from "ethers/lib/utils";
import { FulfillParams } from "./transactionManager";
declare const gelatoSend: (chainId: number, dest: string, data: string, token: string, relayerFee: string) => Promise<any>;
declare const gelatoFulfill: (chainId: number, address: string, abi: Interface, fulfillArgs: FulfillParams) => Promise<any>;
declare const isChainSupportedByGelato: (chainId: number) => Promise<boolean>;
declare const getEstimatedFee: (chainId: number, paymentToken: string, gasLimit: number, isHighPriority: boolean, gasLimitL1?: number) => Promise<BigNumber>;
declare const isOracleActive: (chainId: number) => Promise<boolean>;
declare const isPaymentTokenSupported: (chainId: number, token: string) => Promise<boolean>;
declare const getPaymentTokens: (chainId: number) => Promise<string[]>;
export { gelatoFulfill, isChainSupportedByGelato, gelatoSend, isOracleActive, getEstimatedFee, getPaymentTokens, isPaymentTokenSupported, };
//# sourceMappingURL=gelato.d.ts.map