"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomBytes32 = exports.getRandomAddress = exports.isValidBytes32 = exports.getBytes32Error = exports.isValidAddress = exports.getAddressError = exports.isValidHexString = exports.getHexStringError = void 0;
const ethers_1 = require("ethers");
////////////////////////////////////////
// Validators
/**
 * Does some validation on a value that should be a hex string of a given length. Validates that the hex string is a string, has the proper prefix, passes ethers validation, and has the specified length
 *
 * @param value - Value to validate
 * @param length - (optional) Length the hex string should be
 * @returns undefined if validation passes, or a string representing the appropriate error
 */
const getHexStringError = (value, length) => {
    if (typeof value !== "string") {
        return `Invalid hex string: ${value} is a ${typeof value}, expected a string`;
    }
    if (!value.startsWith("0x")) {
        return `Invalid hex string: ${value} doesn't start with 0x`;
    }
    if (!ethers_1.utils.isHexString(value)) {
        return `Invalid hex string: ${value}`;
    }
    if (length && ethers_1.utils.hexDataLength(value) !== length) {
        return `Invalid hex string of length ${length}: ${value} is ${ethers_1.utils.hexDataLength(value)} bytes long`;
    }
    return undefined;
};
exports.getHexStringError = getHexStringError;
/**
 * Returns a boolean representing if the hex string is valid
 *
 * @param value - Value to validate
 * @returns True if it is a valid hex string, or false otherwise
 */
const isValidHexString = (value) => !(0, exports.getHexStringError)(value);
exports.isValidHexString = isValidHexString;
/**
 * Returns a string if the value is not an address, or undefined if it is a valid address
 *
 * @param value - Value to validate
 * @returns undefined if validation passes, or a string representing the appropriate error
 */
const getAddressError = (value) => {
    try {
        const hexError = (0, exports.getHexStringError)(value, 20);
        if (hexError)
            return hexError;
        ethers_1.utils.getAddress(value);
        return undefined;
    }
    catch (e) {
        return e.message;
    }
};
exports.getAddressError = getAddressError;
/**
 * Returns a boolean representing if the address is valid
 *
 * @param value - Value to validate
 * @returns True if it is a valid address, or false otherwise
 */
const isValidAddress = (value) => !(0, exports.getAddressError)(value);
exports.isValidAddress = isValidAddress;
/**
 * Returns a string if the value is not bytes32, or undefined if it is valid bytes32
 *
 * @param value - Value to validate
 * @returns undefined if validation passes, or a string representing the appropriate error
 */
const getBytes32Error = (value) => {
    const hexStringError = (0, exports.getHexStringError)(value, 32);
    if (hexStringError)
        return hexStringError;
    return undefined;
};
exports.getBytes32Error = getBytes32Error;
/**
 * Returns a boolean representing if the value is valid bytes32
 *
 * @param value - Value to validate
 * @returns True if it is a valid bytes32, or false otherwise
 */
const isValidBytes32 = (value) => !(0, exports.getBytes32Error)(value);
exports.isValidBytes32 = isValidBytes32;
////////////////////////////////////////
// Generators
/**
 * Gets a random valid address
 *
 * @returns An eth address
 */
const getRandomAddress = () => ethers_1.utils.getAddress(ethers_1.utils.hexlify(ethers_1.utils.randomBytes(20)));
exports.getRandomAddress = getRandomAddress;
/**
 * Gets a random bytes32
 *
 * @returns A random/valid bytes32 string
 */
const getRandomBytes32 = () => ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32));
exports.getRandomBytes32 = getRandomBytes32;
//# sourceMappingURL=hexStrings.js.map