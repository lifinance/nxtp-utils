export declare type Values<E> = E[keyof E];
/**
 * Converts an error into a json object
 *
 * @param error - Error to convert
 * @returns An error json
 */
export declare const jsonifyError: (error: NxtpError | Error) => NxtpErrorJson;
export declare type NxtpErrorJson = {
    message: string;
    context: any;
    type: string;
    stack?: string;
};
/**
 * @classdesc The error class used throughout this repo. Defines a context object in addition to the standard message and name fields. The context can hold any information in json form that is relevant to the error
 *
 * Is also able to be hydrated from a json
 */
export declare class NxtpError extends Error {
    readonly msg: Values<typeof NxtpError.reasons>;
    readonly context: any;
    readonly type: string;
    readonly level: "debug" | "info" | "warn" | "error";
    readonly isNxtpError = true;
    static readonly reasons: {
        [key: string]: string;
    };
    constructor(msg: Values<typeof NxtpError.reasons>, context?: any, type?: string, level?: "debug" | "info" | "warn" | "error");
    toJson(): NxtpErrorJson;
    static fromJson(json: NxtpErrorJson): NxtpError;
}
//# sourceMappingURL=error.d.ts.map