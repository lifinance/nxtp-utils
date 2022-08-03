"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const pino_1 = __importDefault(require("pino"));
const request_1 = require("./request");
/**
 * @classdesc Designed to log information in a uniform way to make parsing easier
 */
class Logger {
    constructor(opts, forcedLevel) {
        this.opts = opts;
        this.forcedLevel = forcedLevel;
        this.log = (0, pino_1.default)(this.opts);
    }
    child(bindings, forcedLevel) {
        return new Logger({ ...this.opts, ...bindings }, forcedLevel);
    }
    debug(msg, requestContext, methodContext, ctx) {
        var _a;
        this.print((_a = this.forcedLevel) !== null && _a !== void 0 ? _a : "debug", requestContext, methodContext, this.forcedLevel ? { ...ctx, intendedLevel: "debug" } : ctx, msg);
    }
    info(msg, requestContext, methodContext, ctx) {
        var _a;
        this.print((_a = this.forcedLevel) !== null && _a !== void 0 ? _a : "info", requestContext, methodContext, this.forcedLevel ? { ...ctx, intendedLevel: "info" } : ctx, msg);
    }
    warn(msg, requestContext, methodContext, ctx) {
        var _a;
        this.print((_a = this.forcedLevel) !== null && _a !== void 0 ? _a : "warn", requestContext, methodContext, this.forcedLevel ? { ...ctx, intendedLevel: "warn" } : ctx, msg);
    }
    error(msg, requestContext, methodContext, error, ctx) {
        var _a;
        this.print((_a = this.forcedLevel) !== null && _a !== void 0 ? _a : "error", requestContext, methodContext, this.forcedLevel ? { ...ctx, error, intendedLevel: "error" } : { ...ctx, error }, msg);
    }
    print(level, requestContext = (0, request_1.createRequestContext)("Logger.print"), methodContext = (0, request_1.createMethodContext)("Logger.print"), ctx = {}, msg) {
        return this.log[level]({ requestContext, methodContext, ...ctx }, msg);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map