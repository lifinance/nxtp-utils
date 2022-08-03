export interface Call {
    address: string;
    name: string;
    params?: any[];
}
/**
 * Runs multiple calls at a time, call data should be read methods.
 *
 * @param abi - The ABI data of target contract
 * @param calls - The call data what you want to read from contract
 * @param multicallAddress - The address of multicall contract deployed to configured chain
 * @param rpcUrl - The rpc endpoints what you want to call with
 *
 * @returns Array in ethers.BigNumber
 */
export declare const multicall: (abi: any[], calls: Call[], multicallAddress: string, rpcUrl: string) => Promise<any>;
//# sourceMappingURL=multicall.d.ts.map