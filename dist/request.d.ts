/**
 * Gets a unique identifier.
 * @returns UUID
 */
export declare const getUuid: () => string;
/**
 * Top-level identifier. I.e. API function that was called
 */
export declare type BaseRequestContext = {
    id: string;
    origin: string;
};
export declare type RequestContextWithTransactionId = BaseRequestContext & {
    transactionId: string;
};
export declare type RequestContext<T extends string | undefined = undefined> = T extends undefined ? BaseRequestContext : RequestContextWithTransactionId;
/**
 * Low-level identifier. I.e. what function am i in now
 */
export declare type MethodContext = {
    id: string;
    name: string;
};
/**
 * Creates a RequestContext that logs across functions.
 * @param origin The origin of the request
 * @returns
 */
export declare function createRequestContext<T extends string | undefined = undefined>(origin: string, transactionId?: T): RequestContext<T>;
/**
 * Creates a MethodContext that logs within functions
 * @param name The method name
 * @returns {MethodContext}
 */
export declare const createMethodContext: (name: string) => {
    id: string;
    name: string;
};
export declare const createLoggingContext: <T extends string | undefined = undefined>(methodName: string, inherited?: RequestContext<T> | undefined, transactionId?: T | undefined) => {
    methodContext: {
        id: string;
        name: string;
    };
    requestContext: RequestContext<T>;
};
//# sourceMappingURL=request.d.ts.map