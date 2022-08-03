import { Bindings, LoggerOptions } from "pino";
import { NxtpErrorJson } from "./error";
import { MethodContext, RequestContext } from "./request";
export declare type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
/**
 * @classdesc Designed to log information in a uniform way to make parsing easier
 */
export declare class Logger {
    private readonly opts;
    readonly forcedLevel?: LogLevel | undefined;
    private log;
    constructor(opts: LoggerOptions, forcedLevel?: LogLevel | undefined);
    child(bindings: Bindings, forcedLevel?: LogLevel): Logger;
    debug(msg: string, requestContext?: RequestContext, methodContext?: MethodContext, ctx?: any): void;
    info(msg: string, requestContext?: RequestContext, methodContext?: MethodContext, ctx?: any): void;
    warn(msg: string, requestContext?: RequestContext, methodContext?: MethodContext, ctx?: any): void;
    error(msg: string, requestContext?: RequestContext, methodContext?: MethodContext, error?: NxtpErrorJson, ctx?: any): void;
    private print;
}
//# sourceMappingURL=logger.d.ts.map