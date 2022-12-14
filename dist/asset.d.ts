import { providers, BigNumber } from "ethers";
import { ChainData } from "./chainData";
export declare const getOnchainBalance: (assetId: string, address: string, provider: providers.Provider) => Promise<BigNumber>;
export declare const getDecimalsForAsset: (assetId: string, chainId: number, provider: providers.Provider, chainData?: Map<string, ChainData>) => Promise<number>;
export declare const getMainnetEquivalent: (chainId: number, assetId: string, chainData?: Map<string, ChainData>) => Promise<string | undefined>;
//# sourceMappingURL=asset.d.ts.map