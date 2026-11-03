/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export interface LogContext {
    organizationId?: string;
    sessionId?: string;
    userId?: string;
    subjectId?: string;
    workspaceId?: string;
    instanceId?: string;
}
export declare namespace LogContext {
    type Augmenter = (context: LogContext | undefined) => LogContext | undefined;
    function setAugmenter(augmenter: Augmenter): void;
    /**
     * @deprecated create LogContext directly
     */
    function from(params: {
        userId?: string;
        user?: any;
        request?: any;
    }): LogContext;
}
export declare namespace LogHook {
    type Hook = (item: LogItem) => void;
    function setHook(hook: Hook): void;
}
export interface LogPayload {
}
export declare namespace log {
    function error(context: LogContext, message: string, error: unknown, payload: LogPayload): void;
    function error(context: LogContext, message: string, error: unknown): void;
    function error(context: LogContext, message: string, payload: LogPayload): void;
    function error(context: LogContext, message: string): void;
    function error(context: LogContext, error: unknown, payload: LogPayload): void;
    function error(context: LogContext, error: unknown): void;
    function error(message: string, error: unknown, payload: LogPayload): void;
    function error(message: string, error: unknown): void;
    function error(message: string, payload: LogPayload): void;
    function error(message: string): void;
    function error(error: unknown, payload: LogPayload): void;
    function error(error: unknown): void;
    function warn(context: LogContext, message: string, error: unknown, payload: LogPayload): void;
    function warn(context: LogContext, message: string, error: unknown): void;
    function warn(context: LogContext, message: string, payload: LogPayload): void;
    function warn(context: LogContext, message: string): void;
    function warn(context: LogContext, error: unknown, payload: LogPayload): void;
    function warn(context: LogContext, error: unknown): void;
    function warn(message: string, error: unknown, payload: LogPayload): void;
    function warn(message: string, error: unknown): void;
    function warn(message: string, payload: LogPayload): void;
    function warn(message: string): void;
    function warn(error: unknown, payload: LogPayload): void;
    function warn(error: unknown): void;
    function info(context: LogContext, message: string, error: unknown, payload: LogPayload): void;
    function info(context: LogContext, message: string, error: unknown): void;
    function info(context: LogContext, message: string, payload: LogPayload): void;
    function info(context: LogContext, message: string): void;
    function info(context: LogContext, error: unknown, payload: LogPayload): void;
    function info(context: LogContext, error: unknown): void;
    function info(message: string, error: unknown, payload: LogPayload): void;
    function info(message: string, error: unknown): void;
    function info(message: string, payload: LogPayload): void;
    function info(message: string): void;
    function info(error: unknown, payload: LogPayload): void;
    function info(error: unknown): void;
    function debug(context: LogContext, message: string, error: unknown, payload: LogPayload): void;
    function debug(context: LogContext, message: string, error: unknown): void;
    function debug(context: LogContext, message: string, payload: LogPayload): void;
    function debug(context: LogContext, message: string): void;
    function debug(context: LogContext, error: unknown, payload: LogPayload): void;
    function debug(context: LogContext, error: unknown): void;
    function debug(message: string, error: unknown, payload: LogPayload): void;
    function debug(message: string, error: unknown): void;
    function debug(message: string, payload: LogPayload): void;
    function debug(message: string): void;
    function debug(error: unknown, payload: LogPayload): void;
    function debug(error: unknown): void;
    /**
     * Do not use in frontend.
     */
    function enableJSONLogging(componentArg: string, versionArg: string | undefined, logLevel?: LogrusLogLevel): void;
    function setLogLevel(logLevel: LogrusLogLevel | undefined): void;
    function resetToDefaultLogging(): void;
    function setVersion(versionArg: string): void;
}
export type LogrusLogLevel = keyof typeof LogrusLogLevels;
export declare const LogrusLogLevels: {
    trace: boolean;
    debug: boolean;
    info: boolean;
    warning: boolean;
    error: boolean;
    fatal: boolean;
    panic: boolean;
};
export declare namespace LogrusLogLevel {
    function isGreatherOrEqual(lvl: LogrusLogLevel | undefined, ref: LogrusLogLevel | undefined): boolean;
    function getFromEnv(): LogrusLogLevel | undefined;
}
type LogItem = {
    component?: string;
    severity: string;
    time?: string;
    context?: LogContext;
    environment?: string;
    region?: string;
    message?: string;
    messageStub?: string;
    errorStub?: string;
    error?: unknown;
    payload?: unknown;
    loggedViaConsole?: boolean;
};
export {};
//# sourceMappingURL=logging.d.ts.map