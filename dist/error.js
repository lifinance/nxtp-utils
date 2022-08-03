"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NxtpError = exports.jsonifyError = void 0;
/**
 * Converts an error into a json object
 *
 * @param error - Error to convert
 * @returns An error json
 */
const jsonifyError = (error) => {
    if (error.toJson && typeof error.toJson === "function") {
        return error.toJson();
    }
    return {
        message: error.message,
        type: error.name,
        context: {},
        stack: error.stack,
    };
};
exports.jsonifyError = jsonifyError;
/**
 * @classdesc The error class used throughout this repo. Defines a context object in addition to the standard message and name fields. The context can hold any information in json form that is relevant to the error
 *
 * Is also able to be hydrated from a json
 */
class NxtpError extends Error {
    constructor(msg, context = {}, type = NxtpError.name, level = "error") {
        super(msg);
        this.msg = msg;
        this.context = context;
        this.type = type;
        this.level = level;
        this.isNxtpError = true;
    }
    toJson() {
        return {
            message: this.msg,
            context: this.context,
            type: this.type,
            stack: this.stack,
        };
    }
    static fromJson(json) {
        var _a, _b, _c;
        return new NxtpError(json.message, (_a = json.context) !== null && _a !== void 0 ? _a : {}, (_c = (_b = json.type) !== null && _b !== void 0 ? _b : json.name) !== null && _c !== void 0 ? _c : NxtpError.name);
    }
}
exports.NxtpError = NxtpError;
//# sourceMappingURL=error.js.map