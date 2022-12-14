import { BigNumber, BigNumberish } from "ethers";
/**
 * Converts the given amount to WAD units (with the provided number of decimals)
 *
 * @param amount - Amount to convert
 * @param decimals - (optional) Precision of WAD units (defaults to 18)
 * @returns BigNumber representation of converted to wad units
 */
export declare const toWad: (amount: string, decimals?: number) => BigNumber;
/**
 * Converts a wad amount to normal units (using the provided number of decimals as the wad precision)
 *
 * @param wad - The wad units to convert to normal units
 * @param decimals - (optional) The wad decimal precision (defaults to 18)
 * @returns The amount in normal units
 */
export declare const fromWad: (wad: BigNumberish, decimals?: number) => string;
/**
 * Inverts the given value with the provided precision
 *
 * @param value - Value to invert
 * @param precision - (optional) The precision to use. Defaults to 18
 * @returns
 */
export declare const inverse: (value: string, precision?: number) => string;
/**
 * Drops decimals past the provided prevision
 *
 * @param value Value to sanitize
 * @param decimals - (optional) The precision to use. Defaults to 18
 * @returns
 */
export declare const sanitizeDecimals: (value: string, decimals?: number) => string;
/**
 * Drops all decimals from a string number
 *
 * @param value - Value to drop decimals from
 * @returns The floor integer of the provided value
 */
export declare const removeDecimals: (value: string) => string;
/**
 * Calculates an exchange with the given amount of precision using wad math
 *
 * @remarks Will not round properly, prefer wad calculations
 *
 * @param inputAmount - Amount to exchange
 * @param swapRate - Exchange rate
 * @param precision - (optional) The precision to use in the output amount. Defaults to 18
 * @returns
 */
export declare const calculateExchangeAmount: (inputAmount: string, swapRate: string, precision?: number) => string;
/**
 * Calculates the exchanged amount from the given inputs.
 *
 * @param inputWad - Wad input units to exchange for output
 * @param inputDecimals - Decimals used on input
 * @param swapRate - String rate of input units to output units
 * @param outputDecimals - Precision to use for exchanged amount
 * @returns Equivalent amount of `output` in provided decimal precisions
 */
export declare const calculateExchangeWad: (inputWad: BigNumber, inputDecimals: number, swapRate: string, outputDecimals: number) => BigNumber;
//# sourceMappingURL=math.d.ts.map