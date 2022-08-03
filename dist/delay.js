"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayAndThrow = exports.delay = void 0;
/**
 * Creates a promise that resolves after a specified period
 *
 * @param ms - Time to wait for resolution
 */
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
exports.delay = delay;
const delayAndThrow = (ms, msg = "") => new Promise((res, rej) => setTimeout(() => rej(new Error(msg)), ms));
exports.delayAndThrow = delayAndThrow;
//# sourceMappingURL=delay.js.map