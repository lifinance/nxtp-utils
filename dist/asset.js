"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainnetEquivalent = exports.getDecimalsForAsset = exports.getOnchainBalance = void 0;
const ethers_1 = require("ethers");
const basic_1 = require("./basic");
const chainData_1 = require("./chainData");
const getOnchainBalance = async (assetId, address, provider) => {
    return assetId === ethers_1.constants.AddressZero
        ? provider.getBalance(address)
        : new ethers_1.Contract(assetId, basic_1.ERC20Abi, provider).balanceOf(address);
};
exports.getOnchainBalance = getOnchainBalance;
const getDecimalsForAsset = async (assetId, chainId, provider, chainData) => {
    var _a;
    if (chainData) {
        const chainInfo = chainData.get(chainId.toString());
        const decimals = (_a = chainInfo === null || chainInfo === void 0 ? void 0 : chainInfo.assetId[assetId]) === null || _a === void 0 ? void 0 : _a.decimals;
        if (decimals) {
            return decimals;
        }
    }
    if (assetId === ethers_1.constants.AddressZero) {
        return 18;
    }
    const contract = new ethers_1.Contract(assetId, basic_1.ERC20Abi, provider);
    return await contract.decimals();
};
exports.getDecimalsForAsset = getDecimalsForAsset;
const getMainnetEquivalent = async (chainId, assetId, chainData) => {
    var _a, _b, _c;
    const chaindata = chainData !== null && chainData !== void 0 ? chainData : (await (0, chainData_1.getChainData)());
    const chainInfo = chaindata === null || chaindata === void 0 ? void 0 : chaindata.get(chainId.toString());
    const equiv = chainInfo
        ? (_c = (_b = (_a = chainInfo.assetId[ethers_1.utils.getAddress(assetId)]) !== null && _a !== void 0 ? _a : chainInfo.assetId[assetId.toLowerCase()]) !== null && _b !== void 0 ? _b : chainInfo.assetId[assetId.toUpperCase()]) !== null && _c !== void 0 ? _c : chainInfo.assetId[assetId]
        : undefined;
    if (!equiv || !equiv.mainnetEquivalent) {
        return undefined;
    }
    return ethers_1.utils.getAddress(equiv.mainnetEquivalent);
};
exports.getMainnetEquivalent = getMainnetEquivalent;
//# sourceMappingURL=asset.js.map