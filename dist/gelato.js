"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPaymentTokenSupported = exports.getPaymentTokens = exports.getEstimatedFee = exports.isOracleActive = exports.gelatoSend = exports.isChainSupportedByGelato = exports.gelatoFulfill = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const gelatoServer = "https://relay.gelato.digital";
const gelatoSend = async (chainId, dest, data, token, relayerFee) => {
    const params = { dest, data, token, relayerFee };
    let output;
    try {
        const res = await axios_1.default.post(`${gelatoServer}/relays/${chainId}`, params);
        output = res.data;
    }
    catch (error) {
        console.error(error);
        output = error;
    }
    return output;
};
exports.gelatoSend = gelatoSend;
const gelatoFulfill = async (chainId, address, abi, fulfillArgs) => {
    const args = { ...fulfillArgs, encodedMeta: "0x" };
    const data = abi.encodeFunctionData("fulfill", [args]);
    const token = fulfillArgs.txData.receivingAssetId;
    const ret = await gelatoSend(chainId, address, data, token, fulfillArgs.relayerFee);
    return ret;
};
exports.gelatoFulfill = gelatoFulfill;
const isChainSupportedByGelato = async (chainId) => {
    const chainsSupportedByGelato = await getGelatoRelayChains();
    return chainsSupportedByGelato.includes(chainId.toString());
};
exports.isChainSupportedByGelato = isChainSupportedByGelato;
const getGelatoRelayChains = async () => {
    let result = [];
    try {
        const res = await axios_1.default.get(`${gelatoServer}/relays/`);
        result = res.data.relays;
    }
    catch (error) {
        console.error(error);
    }
    return result;
};
const getEstimatedFee = async (chainId, paymentToken, gasLimit, isHighPriority, gasLimitL1 = 0) => {
    const result = await _getEstimatedFee(chainId, paymentToken, gasLimit, isHighPriority, gasLimitL1);
    return result;
};
exports.getEstimatedFee = getEstimatedFee;
const _getEstimatedFee = async (chainId, paymentToken, gasLimit, isHighPriority, gasLimitL1) => {
    var _a;
    const params = { paymentToken, gasLimit, isHighPriority, gasLimitL1 };
    let result;
    try {
        const res = await axios_1.default.get(`${gelatoServer}/oracles/${chainId}/estimate`, { params });
        result = ethers_1.BigNumber.from(res.data.estimatedFee);
    }
    catch (error) {
        let message = error.message;
        if (axios_1.default.isAxiosError(error) && error.response) {
            message = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
        }
        throw new Error(message);
    }
    return result;
};
const isOracleActive = async (chainId) => {
    const oracles = await getGelatoOracles();
    return oracles.includes(chainId.toString());
};
exports.isOracleActive = isOracleActive;
const getGelatoOracles = async () => {
    let result = [];
    try {
        const res = await axios_1.default.get(`${gelatoServer}/oracles/`);
        result = res.data.oracles;
    }
    catch (error) {
        console.error(error);
    }
    return result;
};
const isPaymentTokenSupported = async (chainId, token) => {
    const paymentTokens = await getPaymentTokens(chainId);
    const lowerPaymentTokens = paymentTokens.map((address) => {
        return address.toLowerCase();
    });
    return lowerPaymentTokens.includes(token.toString().toLowerCase());
};
exports.isPaymentTokenSupported = isPaymentTokenSupported;
const getPaymentTokens = async (chainId) => {
    let result = [];
    try {
        const res = await axios_1.default.get(`${gelatoServer}/oracles/${chainId}/paymentTokens/`);
        result = res.data.paymentTokens;
    }
    catch (error) {
        console.error(error);
    }
    return result;
};
exports.getPaymentTokens = getPaymentTokens;
//# sourceMappingURL=gelato.js.map