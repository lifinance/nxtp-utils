"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostnameFromRegex = exports.ajv = exports.getRateFromPercentage = exports.validateAndParseAddress = exports.mkSig = exports.mkBytes32 = exports.mkHash = exports.mkAddress = void 0;
const ethers_1 = require("ethers");
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
/**
 * Creates an eth-address compatible string with given prefix
 *
 * @param prefix  - (optional) String prefix
 * @returns 24 byte string
 */
const mkAddress = (prefix = "0x0") => {
    return prefix.padEnd(42, "0");
};
exports.mkAddress = mkAddress;
/**
 * Creates a 32-byte string
 *
 * @param prefix - (optional) String prefix
 * @returns 32 byte string with provided prefix
 */
const mkHash = (prefix = "0x") => {
    return prefix.padEnd(66, "0");
};
exports.mkHash = mkHash;
/**
 * Creates a 32-byte hex string for tests
 *
 * @param prefix - (optional) Prefix of the hex string to pad
 * @returns 32-byte hex string
 */
const mkBytes32 = (prefix = "0xa") => {
    return prefix.padEnd(66, "0");
};
exports.mkBytes32 = mkBytes32;
/**
 * Generates a string the same length as a signature
 *
 * @param prefix - (optional) Prefix of signature to create
 * @returns A string the same length as a signature
 */
const mkSig = (prefix = "0xa") => {
    return prefix.padEnd(132, "0");
};
exports.mkSig = mkSig;
/**
 * Validates an address and returns the parsed (checksummed) version of that address
 *
 * @param address the unchecksummed hex address
 * @returns The checksummed address
 */
function validateAndParseAddress(address) {
    try {
        return ethers_1.utils.getAddress(address);
    }
    catch (error) {
        throw new Error(`${address} is not a valid address.`);
    }
}
exports.validateAndParseAddress = validateAndParseAddress;
function getRateFromPercentage(percentage) {
    const rate = (1 - parseFloat(percentage) / 100).toString();
    return rate;
}
exports.getRateFromPercentage = getRateFromPercentage;
exports.ajv = (0, ajv_formats_1.default)(new ajv_1.default(), [
    "date-time",
    "time",
    "date",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uri",
    "uri-reference",
    "uuid",
    "uri-template",
    "json-pointer",
    "relative-json-pointer",
    "regex",
])
    .addKeyword("kind")
    .addKeyword("modifier");
/**
 * Returns domain name from url string
 * @param url The http or https string
 * @returns https://api.thegraph.com/subgraphs/name... => api.thegraph.com
 */
const getHostnameFromRegex = (url) => {
    const matches = /^https?:\/\/([^/?#]+)(?:[/?#]|$)/i.exec(url);
    return matches && matches[1];
};
exports.getHostnameFromRegex = getHostnameFromRegex;
//# sourceMappingURL=util.js.map