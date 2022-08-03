export declare const encrypt: (message: string, publicKey: string) => Promise<string>;
export declare const ethereumRequest: (method: string, params: string[]) => Promise<any>;
/**
 * Function to derive the address from an EC public key
 *
 * @param publicKey the public key to derive
 *
 * @returns the address
 */
export declare const getAddressFromPublicKey: (publicKey: string) => string;
/**
 * Converts a public key to its compressed form.
 */
export declare const compressPublicKey: (publicKey: string) => Uint8Array;
//# sourceMappingURL=crypto.d.ts.map