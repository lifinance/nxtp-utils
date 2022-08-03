"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressPublicKey = exports.getAddressFromPublicKey = exports.ethereumRequest = exports.encrypt = void 0;
const eth_sig_util_1 = require("eth-sig-util");
const ethers_1 = require("ethers");
const secp256k1_1 = require("secp256k1");
// /**
//  * Encrypts some message with the provided public key
//  *
//  * @param message - Information to encrypt
//  * @param publicKey - Public key to encrypt with
//  * @returns Encrypted message
//  */
const encrypt = async (message, publicKey) => {
    const buf = Buffer.from(JSON.stringify((0, eth_sig_util_1.encrypt)(publicKey, { data: message }, "x25519-xsalsa20-poly1305")), "utf8");
    return "0x" + buf.toString("hex");
};
exports.encrypt = encrypt;
const ethereumRequest = async (method, params) => {
    // If ethereum.request() exists, the provider is probably EIP-1193 compliant.
    return await ethereum.request({
        method,
        params,
    });
};
exports.ethereumRequest = ethereumRequest;
/**
 * Function to derive the address from an EC public key
 *
 * @param publicKey the public key to derive
 *
 * @returns the address
 */
const getAddressFromPublicKey = (publicKey) => {
    try {
        return ethers_1.utils.computeAddress((0, exports.compressPublicKey)(publicKey));
    }
    catch (e) {
        if (e.message === "public key length is invalid" ||
            e.message === "Expected public key to be an Uint8Array with length [33, 65]" ||
            e.code === "INVALID_ARGUMENT") {
            throw new Error("The public key must be a string representing 64 bytes");
        }
        throw e;
    }
};
exports.getAddressFromPublicKey = getAddressFromPublicKey;
/**
 * Converts a public key to its compressed form.
 */
const compressPublicKey = (publicKey) => {
    publicKey = publicKey.replace(/^0x/, "");
    // if there are more bytes than the key itself, it means there is already a prefix
    if (publicKey.length % 32 === 0) {
        publicKey = `04${publicKey}`;
    }
    return (0, secp256k1_1.publicKeyConvert)(Buffer.from(publicKey, "hex"));
};
exports.compressPublicKey = compressPublicKey;
//# sourceMappingURL=crypto.js.map