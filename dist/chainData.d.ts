export declare const CHAIN_ID: {
    MAINNET: number;
    RINKEBY: number;
    GOERLI: number;
    OPTIMISM: number;
    BSC: number;
    XDAI: number;
    FUSE: number;
    MATIC: number;
    FANTOM: number;
    MOVR: number;
    ARBITRUM: number;
    AVALANCHE: number;
};
export declare type ChainData = {
    name: string;
    chainId: number;
    confirmations: number;
    shortName: string;
    chain: string;
    network: string;
    networkId: number;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: string;
    };
    assetId: Record<string, {
        symbol: string;
        mainnetEquivalent?: string;
        decimals?: number;
    }>;
    rpc: string[];
    subgraph: string[];
    analyticsSubgraph?: string[];
    faucets: string[];
    infoURL: string;
    gasStations: string[];
    explorers: {
        name: string;
        url: string;
        icon: string;
        standard: string;
    }[];
    gasEstimates: {
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
        gasPriceFactor?: string;
    };
};
export declare const chainDataToMap: (data: any) => Map<string, ChainData>;
export declare const getChainData: () => Promise<Map<string, ChainData> | undefined>;
//# sourceMappingURL=chainData.d.ts.map