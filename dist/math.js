"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExchangeWad = exports.calculateExchangeAmount = exports.removeDecimals = exports.sanitizeDecimals = exports.inverse = exports.fromWad = exports.toWad = void 0;
const ethers_1 = require("ethers");
/**
 * Converts the given amount to WAD units (with the provided number of decimals)
 *
 * @param amount - Amount to convert
 * @param decimals - (optional) Precision of WAD units (defaults to 18)
 * @returns BigNumber representation of converted to wad units
 */
const toWad = (amount, decimals = 18) => {
    return ethers_1.utils.parseUnits((0, exports.sanitizeDecimals)(amount, decimals), decimals);
};
exports.toWad = toWad;
/**
 * Converts a wad amount to normal units (using the provided number of decimals as the wad precision)
 *
 * @param wad - The wad units to convert to normal units
 * @param decimals - (optional) The wad decimal precision (defaults to 18)
 * @returns The amount in normal units
 */
const fromWad = (wad, decimals = 18) => {
    return (0, exports.sanitizeDecimals)(ethers_1.utils.formatUnits(wad, decimals), decimals);
};
exports.fromWad = fromWad;
/**
 * Inverts the given value with the provided precision
 *
 * @param value - Value to invert
 * @param precision - (optional) The precision to use. Defaults to 18
 * @returns
 */
const inverse = (value, precision = 18) => (0, exports.fromWad)((0, exports.toWad)("1", precision * 2).div((0, exports.toWad)(value, precision)), precision);
exports.inverse = inverse;
/**
 * Drops decimals past the provided prevision
 *
 * @param value Value to sanitize
 * @param decimals - (optional) The precision to use. Defaults to 18
 * @returns
 */
const sanitizeDecimals = (value, decimals = 18) => {
    const [integer, fractional] = value.split(".");
    const _fractional = fractional ? fractional.substring(0, decimals).replace(/0+$/gi, "") : undefined;
    return _fractional ? [integer, _fractional].join(".") : integer;
};
exports.sanitizeDecimals = sanitizeDecimals;
/**
 * Drops all decimals from a string number
 *
 * @param value - Value to drop decimals from
 * @returns The floor integer of the provided value
 */
const removeDecimals = (value) => {
    const [integer] = value.split(".");
    return integer;
};
exports.removeDecimals = removeDecimals;
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
const calculateExchangeAmount = (inputAmount, swapRate, precision = 18) => {
    const swapRateWad = (0, exports.toWad)(swapRate, precision);
    const inputWad = (0, exports.toWad)(inputAmount, precision * 2);
    const outputWad = inputWad.mul(swapRateWad);
    const outputAmount = (0, exports.fromWad)(outputWad, precision * 3);
    return outputAmount;
};
exports.calculateExchangeAmount = calculateExchangeAmount;
/**
 * Calculates the exchanged amount from the given inputs.
 *
 * @param inputWad - Wad input units to exchange for output
 * @param inputDecimals - Decimals used on input
 * @param swapRate - String rate of input units to output units
 * @param outputDecimals - Precision to use for exchanged amount
 * @returns Equivalent amount of `output` in provided decimal precisions
 */
const calculateExchangeWad = (inputWad, inputDecimals, swapRate, outputDecimals) => {
    const inputAmount = (0, exports.fromWad)(inputWad, inputDecimals);
    const outputAmount = (0, exports.calculateExchangeAmount)(inputAmount, swapRate);
    const outputWad = (0, exports.toWad)(outputAmount, outputDecimals);
    return outputWad;
};
exports.calculateExchangeWad = calculateExchangeWad;
//# sourceMappingURL=math.js.map