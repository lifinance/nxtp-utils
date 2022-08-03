"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverAmount = exports.getSwapRate = void 0;
const ethers_1 = require("ethers");
const util_1 = require("./util");
const math_1 = require("./math");
const ROUTER_FEE = "0.05"; // 0.05%
/**
 * Returns the swapRate
 *
 * @param TODO
 * @returns The swapRate, determined by the AMM
 *
 * @remarks
 * TODO: getSwapRate using AMM
 */
const getSwapRate = async () => {
    return "1";
};
exports.getSwapRate = getSwapRate;
/**
 * Returns the amount * swapRate to deduct fees when going from sending -> recieving chain to incentivize routing.
 *
 * @param amount The amount of the transaction on the sending chain
 * @returns The amount, less fees as determined by the swapRate
 *
 * @remarks
 * Router fulfills on sending chain, so gets `amount`, and user fulfills on receiving chain so gets `amount * swapRate`
 */
const getReceiverAmount = async (amount, inputDecimals, outputDecimals) => {
    // 1. swap rate from AMM
    const swapRate = await (0, exports.getSwapRate)();
    const amountAfterSwapRate = (0, math_1.calculateExchangeWad)(ethers_1.BigNumber.from(amount), inputDecimals, swapRate, outputDecimals);
    // 2. flat fee by Router
    const routerFeeRate = (0, util_1.getRateFromPercentage)(ROUTER_FEE);
    const receivingAmountFloat = (0, math_1.calculateExchangeAmount)(amountAfterSwapRate.toString(), routerFeeRate);
    const receivingAmount = receivingAmountFloat.split(".")[0];
    const routerFee = amountAfterSwapRate.sub(receivingAmount);
    return { receivingAmount, routerFee: routerFee.toString(), amountAfterSwapRate: amountAfterSwapRate.toString() };
};
exports.getReceiverAmount = getReceiverAmount;
//# sourceMappingURL=router.js.map