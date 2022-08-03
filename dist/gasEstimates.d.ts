import { ChainData } from ".";
export declare const DEFAULT_GAS_ESTIMATES: {
    prepare: string;
    fulfill: string;
    cancel: string;
    removeLiquidity: string;
    prepareL1: string;
    fulfillL1: string;
    cancelL1: string;
    removeLiquidityL1: string;
    prepareRouterContract: string;
    fulfillRouterContract: string;
    cancelRouterContract: string;
    removeLiquidityRouterContract: string;
    gasPriceFactor: string;
};
export declare type GasEstimates = {
    prepare: string;
    fulfill: string;
    cancel: string;
    removeLiquidity: string;
    prepareRouterContract: string;
    fulfillRouterContract: string;
    cancelRouterContract: string;
    removeLiquidityRouterContract: string;
    prepareL1?: string;
    fulfillL1?: string;
    cancelL1?: string;
    removeLiquidityL1?: string;
    gasPriceFactor: string;
};
export declare const getHardcodedGasLimits: (chainId: number, chainData?: Map<string, ChainData>) => Promise<GasEstimates>;
//# sourceMappingURL=gasEstimates.d.ts.map