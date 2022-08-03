"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceOracleAbi = exports.ERC20Abi = exports.TDecimalString = exports.TChainId = exports.TUrl = exports.TIntegerString = exports.TBytes32 = exports.TAddress = void 0;
const typebox_1 = require("@sinclair/typebox");
// String pattern types
exports.TAddress = typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{40}$/);
exports.TBytes32 = typebox_1.Type.RegEx(/^0x[a-fA-F0-9]{64}$/);
exports.TIntegerString = typebox_1.Type.RegEx(/^([0-9])*$/);
exports.TUrl = typebox_1.Type.String({ format: "uri" });
// Convenience types
exports.TChainId = typebox_1.Type.Number({ minimum: 1 });
exports.TDecimalString = typebox_1.Type.RegEx(/^[0-9]*\.?[0-9]*$/);
exports.ERC20Abi = [
    // Read-Only Functions
    "function name() public view returns (string)",
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function symbol() view returns (string)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",
    "function mint(address account, uint256 amount)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
];
exports.PriceOracleAbi = [
    // Read-Only Functions
    "function getTokenPrice(address token) external view returns (uint256)",
];
//# sourceMappingURL=basic.js.map