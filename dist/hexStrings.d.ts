/**
 * Does some validation on a value that should be a hex string of a given length. Validates that the hex string is a string, has the proper prefix, passes ethers validation, and has the specified length
 *
 * @param value - Value to validate
 * @param length - (optional) Length the hex string should be
 * @returns undefined if validation passes, or a string representing the appropriate error
 */
export declare const getHexStringError: (value: any, length?: number) => string | undefined;
/**
 * Returns a boolean representing if the hex string is valid
 *
 * @param value - Value to validate
 * @returns True if it is a valid hex string, or false otherwise
 */
export declare const isValidHexString: (value: any) => boolean;
/**
 * Returns a string if the value is not an address, or undefined if it is a valid address
 *
 * @param value - Value to validate
 * @returns undefined if validation passes, or a string representing the appropriate error
 */
export declare const getAddressError: (value: any) => string | undefined;
/**
 * Returns a boolean representing if the address is valid
 *
 * @param value - Value to validate
 * @returns True if it is a valid address, or false otherwise
 */
export declare const isValidAddress: (value: any) => boolean;
/**
 * Returns a string if the value is not bytes32, or undefined if it is valid bytes32
 *
 * @param value - Value to validate
 * @returns undefined if validation passes, or a string representing the appropriate error
 */
export declare const getBytes32Error: (value: any) => string | undefined;
/**
 * Returns a boolean representing if the value is valid bytes32
 *
 * @param value - Value to validate
 * @returns True if it is a valid bytes32, or false otherwise
 */
export declare const isValidBytes32: (value: any) => boolean;
/**
 * Gets a random valid address
 *
 * @returns An eth address
 */
export declare const getRandomAddress: () => string;
/**
 * Gets a random bytes32
 *
 * @returns A random/valid bytes32 string
 */
export declare const getRandomBytes32: () => string;
//# sourceMappingURL=hexStrings.d.ts.map