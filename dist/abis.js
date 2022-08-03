"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulticallAbi = void 0;
exports.MulticallAbi = [
    {
        constant: true,
        inputs: [
            {
                components: [
                    { name: "target", type: "address" },
                    { name: "callData", type: "bytes" },
                ],
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate",
        outputs: [
            { name: "blockNumber", type: "uint256" },
            { name: "returnData", type: "bytes[]" },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "addr", type: "address" }],
        name: "getEthBalance",
        outputs: [{ name: "balance", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];
//# sourceMappingURL=abis.js.map