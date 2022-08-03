"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainData = exports.chainDataToMap = exports.CHAIN_ID = void 0;
const fs = __importStar(require("fs"));
const utils_1 = require("ethers/lib/utils");
exports.CHAIN_ID = {
    MAINNET: 1,
    RINKEBY: 4,
    GOERLI: 5,
    OPTIMISM: 10,
    BSC: 56,
    XDAI: 100,
    FUSE: 122,
    MATIC: 137,
    FANTOM: 250,
    MOVR: 1285,
    ARBITRUM: 42161,
    AVALANCHE: 43114,
};
// Helper method to reorganize this list into a mapping by chain ID for quicker lookup.
const chainDataToMap = (data) => {
    const chainData = new Map();
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const chainId = item.chainId.toString();
        chainData.set(chainId, Object.fromEntries(Object.entries(item).filter((e) => e[0] !== "chainId")));
    }
    return chainData;
};
exports.chainDataToMap = chainDataToMap;
const getChainData = async () => {
    const url = "https://raw.githubusercontent.com/connext/chaindata/main/crossChain.json";
    try {
        const data = await (0, utils_1.fetchJson)(url);
        return (0, exports.chainDataToMap)(data);
    }
    catch (err) {
        console.error(`Error occurred retrieving chain data from ${url}`, err);
        // Check to see if we have the chain data cached locally.
        if (fs.existsSync("./chaindata.json")) {
            console.info("Using cached chain data.");
            const data = JSON.parse(fs.readFileSync("./chaindata.json", "utf-8"));
            return (0, exports.chainDataToMap)(data);
        }
        // It could be dangerous to let the router start without the chain data, but there's an override in place just in case.
        console.warn("Could not fetch chain data, and no cached chain data was available.");
        return undefined;
    }
};
exports.getChainData = getChainData;
//# sourceMappingURL=chainData.js.map