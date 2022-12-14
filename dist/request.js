"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggingContext = exports.createMethodContext = exports.createRequestContext = exports.getUuid = void 0;
const hyperid_1 = __importDefault(require("hyperid"));
const hId = (0, hyperid_1.default)();
/**
 * Gets a unique identifier.
 * @returns UUID
 */
const getUuid = () => hId();
exports.getUuid = getUuid;
/**
 * Creates a RequestContext that logs across functions.
 * @param origin The origin of the request
 * @returns
 */
function createRequestContext(origin, transactionId) {
    const id = (0, exports.getUuid)();
    if (transactionId) {
        return { id, origin, transactionId };
    }
    // FIXME: why will it not play nicely
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { id, origin };
}
exports.createRequestContext = createRequestContext;
/**
 * Creates a MethodContext that logs within functions
 * @param name The method name
 * @returns {MethodContext}
 */
const createMethodContext = (name) => {
    return { id: (0, exports.getUuid)(), name };
};
exports.createMethodContext = createMethodContext;
const createLoggingContext = (methodName, inherited, transactionId) => {
    if (transactionId && inherited) {
        inherited = {
            transactionId,
            ...inherited,
        };
    }
    return {
        methodContext: (0, exports.createMethodContext)(methodName),
        requestContext: inherited !== null && inherited !== void 0 ? inherited : createRequestContext(methodName, transactionId),
    };
};
exports.createLoggingContext = createLoggingContext;
//# sourceMappingURL=request.js.map