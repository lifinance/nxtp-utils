/**
 * Returns the swapRate
 *
 * @param TODO
 * @returns The swapRate, determined by the AMM
 *
 * @remarks
 * TODO: getSwapRate using AMM
 */
export declare const getSwapRate: () => Promise<string>;
/**
 * Returns the amount * swapRate to deduct fees when going from sending -> recieving chain to incentivize routing.
 *
 * @param amount The amount of the transaction on the sending chain
 * @returns The amount, less fees as determined by the swapRate
 *
 * @remarks
 * Router fulfills on sending chain, so gets `amount`, and user fulfills on receiving chain so gets `amount * swapRate`
 */
export declare const getReceiverAmount: (amount: string, inputDecimals: number, outputDecimals: number) => Promise<{
    receivingAmount: string;
    routerFee: string;
    amountAfterSwapRate: string;
}>;
//# sourceMappingURL=router.d.ts.map