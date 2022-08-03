"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimpleRPCPRovider = void 0;
const ethers_1 = require("ethers");
const getSimpleRPCPRovider = (rpcUrl) => {
    return new ethers_1.ethers.providers.StaticJsonRpcProvider(rpcUrl);
};
exports.getSimpleRPCPRovider = getSimpleRPCPRovider;
//# sourceMappingURL=providers.js.map