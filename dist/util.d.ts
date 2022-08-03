/**
 * Creates an eth-address compatible string with given prefix
 *
 * @param prefix  - (optional) String prefix
 * @returns 24 byte string
 */
export declare const mkAddress: (prefix?: string) => string;
/**
 * Creates a 32-byte string
 *
 * @param prefix - (optional) String prefix
 * @returns 32 byte string with provided prefix
 */
export declare const mkHash: (prefix?: string) => string;
/**
 * Creates a 32-byte hex string for tests
 *
 * @param prefix - (optional) Prefix of the hex string to pad
 * @returns 32-byte hex string
 */
export declare const mkBytes32: (prefix?: string) => string;
/**
 * Generates a string the same length as a signature
 *
 * @param prefix - (optional) Prefix of signature to create
 * @returns A string the same length as a signature
 */
export declare const mkSig: (prefix?: string) => string;
/**
 * Validates an address and returns the parsed (checksummed) version of that address
 *
 * @param address the unchecksummed hex address
 * @returns The checksummed address
 */
export declare function validateAndParseAddress(address: string): string;
export declare function getRateFromPercentage(percentage: string): string;
export declare const ajv: import("ajv/dist/core").default;
/**
 * Returns domain name from url string
 * @param url The http or https string
 * @returns https://api.thegraph.com/subgraphs/name... => api.thegraph.com
 */
export declare const getHostnameFromRegex: (url: string) => string | null;
//# sourceMappingURL=util.d.ts.map