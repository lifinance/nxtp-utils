"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHardcodedGasLimits = exports.DEFAULT_GAS_ESTIMATES = void 0;
const _1 = require(".");
exports.DEFAULT_GAS_ESTIMATES = {
    prepare: "190000",
    fulfill: "200000",
    cancel: "204271",
    removeLiquidity: "45000",
    prepareL1: "20623",
    fulfillL1: "13965",
    cancelL1: "13965",
    removeLiquidityL1: "45000",
    prepareRouterContract: "190000",
    fulfillRouterContract: "200000",
    cancelRouterContract: "204271",
    removeLiquidityRouterContract: "48000",
    gasPriceFactor: "1000000000000000000",
};
const getHardcodedGasLimits = async (chainId, chainData) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _2, _3;
    const chaindata = chainData !== null && chainData !== void 0 ? chainData : (await (0, _1.getChainData)());
    const chainInfo = (_a = chaindata === null || chaindata === void 0 ? void 0 : chaindata.get(chainId.toString())) !== null && _a !== void 0 ? _a : chainData === null || chainData === void 0 ? void 0 : chainData.get("0");
    if (!chainInfo)
        return exports.DEFAULT_GAS_ESTIMATES;
    const prepare = (_c = (_b = chainInfo.gasEstimates) === null || _b === void 0 ? void 0 : _b.prepare) !== null && _c !== void 0 ? _c : exports.DEFAULT_GAS_ESTIMATES.prepare;
    const fulfill = (_e = (_d = chainInfo.gasEstimates) === null || _d === void 0 ? void 0 : _d.fulfill) !== null && _e !== void 0 ? _e : exports.DEFAULT_GAS_ESTIMATES.fulfill;
    const cancel = (_g = (_f = chainInfo.gasEstimates) === null || _f === void 0 ? void 0 : _f.cancel) !== null && _g !== void 0 ? _g : exports.DEFAULT_GAS_ESTIMATES.cancel;
    const removeLiquidity = (_j = (_h = chainInfo.gasEstimates) === null || _h === void 0 ? void 0 : _h.removeLiquidity) !== null && _j !== void 0 ? _j : exports.DEFAULT_GAS_ESTIMATES.removeLiquidity;
    const prepareRouterContract = (_l = (_k = chainInfo.gasEstimates) === null || _k === void 0 ? void 0 : _k.prepareRouterContract) !== null && _l !== void 0 ? _l : exports.DEFAULT_GAS_ESTIMATES.prepareRouterContract;
    const fulfillRouterContract = (_o = (_m = chainInfo.gasEstimates) === null || _m === void 0 ? void 0 : _m.fulfillRouterContract) !== null && _o !== void 0 ? _o : exports.DEFAULT_GAS_ESTIMATES.fulfillRouterContract;
    const cancelRouterContract = (_q = (_p = chainInfo.gasEstimates) === null || _p === void 0 ? void 0 : _p.cancelRouterContract) !== null && _q !== void 0 ? _q : exports.DEFAULT_GAS_ESTIMATES.cancelRouterContract;
    const removeLiquidityRouterContract = (_s = (_r = chainInfo.gasEstimates) === null || _r === void 0 ? void 0 : _r.removeLiquidityRouterContract) !== null && _s !== void 0 ? _s : exports.DEFAULT_GAS_ESTIMATES.removeLiquidityRouterContract;
    const prepareL1 = (_u = (_t = chainInfo.gasEstimates) === null || _t === void 0 ? void 0 : _t.prepareL1) !== null && _u !== void 0 ? _u : exports.DEFAULT_GAS_ESTIMATES.prepareL1;
    const fulfillL1 = (_w = (_v = chainInfo.gasEstimates) === null || _v === void 0 ? void 0 : _v.fulfillL1) !== null && _w !== void 0 ? _w : exports.DEFAULT_GAS_ESTIMATES.fulfillL1;
    const cancelL1 = (_y = (_x = chainInfo.gasEstimates) === null || _x === void 0 ? void 0 : _x.cancelL1) !== null && _y !== void 0 ? _y : exports.DEFAULT_GAS_ESTIMATES.cancelL1;
    const removeLiquidityL1 = (_0 = (_z = chainInfo.gasEstimates) === null || _z === void 0 ? void 0 : _z.removeLiquidityL1) !== null && _0 !== void 0 ? _0 : exports.DEFAULT_GAS_ESTIMATES.removeLiquidityL1;
    const gasPriceFactor = (_3 = (_2 = chainInfo.gasEstimates) === null || _2 === void 0 ? void 0 : _2.gasPriceFactor) !== null && _3 !== void 0 ? _3 : exports.DEFAULT_GAS_ESTIMATES.gasPriceFactor;
    const res = {
        prepare,
        fulfill,
        cancel,
        removeLiquidity,
        prepareRouterContract,
        fulfillRouterContract,
        cancelRouterContract,
        removeLiquidityRouterContract,
        prepareL1,
        fulfillL1,
        cancelL1,
        removeLiquidityL1,
        gasPriceFactor,
    };
    return res;
};
exports.getHardcodedGasLimits = getHardcodedGasLimits;
//# sourceMappingURL=gasEstimates.js.map