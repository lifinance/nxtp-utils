"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNtpTimeSeconds = void 0;
/**
 * Gets the current time in seconds.
 * @returns The current time in seconds.
 */
const getNtpTimeSeconds = async () => {
    return Math.floor(Date.now() / 1000);
};
exports.getNtpTimeSeconds = getNtpTimeSeconds;
//# sourceMappingURL=time.js.map