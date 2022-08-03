"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multicall = void 0;
const ethers_1 = require("ethers");
// eslint-disable-next-line node/no-extraneous-import
const abi_1 = require("@ethersproject/abi");
const _1 = require(".");
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
const multicall = async (abi, calls, multicallAddress, rpcUrl) => {
    const abiInterface = new abi_1.Interface(abi);
    const calldata = calls.map((call) => [
        call.address.toLowerCase(),
        abiInterface.encodeFunctionData(call.name, call.params),
    ]);
    const multicallContract = new ethers_1.Contract(multicallAddress, _1.MulticallAbi, (0, _1.getSimpleRPCPRovider)(rpcUrl));
    const { returnData } = await multicallContract.aggregate(calldata);
    const res = returnData.map((call, i) => abiInterface.decodeFunctionResult(calls[i].name, call));
    return res;
};
exports.multicall = multicall;
//# sourceMappingURL=multicall.js.map