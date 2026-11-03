"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogrusLogLevel = exports.LogrusLogLevels = exports.log = exports.LogHook = exports.LogContext = void 0;
const scrubbing_1 = require("./scrubbing");
const inspect = require("util").inspect; // undefined in frontend
const plainLogging = false; // set to true during development to get non JSON output
let jsonLogging = false;
let component;
let version;
/**
 * allows to globally augment the log context, default is an identity function
 */
let logContextAugmenter = (context) => context;
var LogContext;
(function (LogContext) {
    function setAugmenter(augmenter) {
        logContextAugmenter = augmenter;
    }
    LogContext.setAugmenter = setAugmenter;
    /**
     * @deprecated create LogContext directly
     */
    function from(params) {
        var _a, _b;
        return {
            sessionId: (_a = params.request) === null || _a === void 0 ? void 0 : _a.requestID,
            userId: params.userId || ((_b = params.user) === null || _b === void 0 ? void 0 : _b.id),
        };
    }
    LogContext.from = from;
})(LogContext || (exports.LogContext = LogContext = {}));
let logItemHook = undefined;
var LogHook;
(function (LogHook) {
    function setHook(hook) {
        logItemHook = hook;
    }
    LogHook.setHook = setHook;
})(LogHook || (exports.LogHook = LogHook = {}));
var log;
(function (log) {
    function error(...args) {
        errorLog(false, args);
    }
    log.error = error;
    function warn(...args) {
        warnLog(false, args);
    }
    log.warn = warn;
    function info(...args) {
        infoLog(false, args);
    }
    log.info = info;
    function debug(...args) {
        debugLog(false, args);
    }
    log.debug = debug;
    /**
     * Do not use in frontend.
     */
    function enableJSONLogging(componentArg, versionArg, logLevel) {
        component = componentArg;
        version = versionArg;
        setLogLevel(logLevel);
    }
    log.enableJSONLogging = enableJSONLogging;
    function setLogLevel(logLevel) {
        jsonLogging = true;
        console.error = function (...args) {
            errorLog(true, args);
        };
        console.warn = function (...args) {
            warnLog(true, args);
        };
        console.info = function (...args) {
            infoLog(true, args);
        };
        console.debug = function (...args) {
            debugLog(true, args);
        };
        console.log = console.info;
        // FIXME wrap also other console methods (e.g. trace())
        // set/unset log functions based on loglevel so we only have to evaluate once, not every call
        const noop = () => { };
        const setLog = (logFunc, funcLevel) => {
            return LogrusLogLevel.isGreatherOrEqual(funcLevel, logLevel) ? logFunc : noop;
        };
        errorLog = setLog(doErrorLog, "error");
        warnLog = setLog(doWarnLog, "warning");
        infoLog = setLog(doInfoLog, "info");
        debugLog = setLog(doDebugLog, "debug");
    }
    log.setLogLevel = setLogLevel;
    function resetToDefaultLogging() {
        jsonLogging = false;
        console.log = logConsoleLog;
        console.error = errorConsoleLog;
        console.warn = warnConsoleLog;
        console.info = infoConsoleLog;
        console.debug = debugConsoleLog;
    }
    log.resetToDefaultLogging = resetToDefaultLogging;
    function setVersion(versionArg) {
        version = versionArg;
    }
    log.setVersion = setVersion;
})(log || (exports.log = log = {}));
let errorLog = doErrorLog;
function doErrorLog(calledViaConsole, args) {
    doLog(calledViaConsole, errorConsoleLog, "ERROR", args);
}
let warnLog = doWarnLog;
function doWarnLog(calledViaConsole, args) {
    doLog(calledViaConsole, warnConsoleLog, "WARNING", args);
}
let infoLog = doInfoLog;
function doInfoLog(calledViaConsole, args) {
    doLog(calledViaConsole, infoConsoleLog, "INFO", args);
}
let debugLog = doDebugLog;
function doDebugLog(calledViaConsole, args) {
    doLog(calledViaConsole, debugConsoleLog, "DEBUG", args);
}
exports.LogrusLogLevels = {
    trace: true,
    debug: true,
    info: true,
    warning: true,
    error: true,
    fatal: true,
    panic: true,
};
var LogrusLogLevel;
(function (LogrusLogLevel) {
    function isGreatherOrEqual(lvl, ref) {
        if (lvl === undefined) {
            return false;
        }
        if (ref === undefined) {
            return true;
        }
        return getLevelArity(lvl) >= getLevelArity(ref);
    }
    LogrusLogLevel.isGreatherOrEqual = isGreatherOrEqual;
    function getLevelArity(lvl) {
        return Object.keys(exports.LogrusLogLevels).findIndex((l) => l === lvl);
    }
    function getFromEnv() {
        const lvlStr = process.env.LOG_LEVEL;
        if (!lvlStr) {
            return undefined;
        }
        const lvl = lvlStr;
        const exists = exports.LogrusLogLevels[lvl];
        if (!exists) {
            return undefined;
        }
        return lvl;
    }
    LogrusLogLevel.getFromEnv = getFromEnv;
})(LogrusLogLevel || (exports.LogrusLogLevel = LogrusLogLevel = {}));
var GoogleLogSeverity;
(function (GoogleLogSeverity) {
    GoogleLogSeverity.isGreaterOrEqualThanWarning = (severity) => {
        switch (severity) {
            case "INFO":
            case "DEBUG":
                return false;
            default:
                return true;
        }
    };
})(GoogleLogSeverity || (GoogleLogSeverity = {}));
function doLog(calledViaConsole, consoleLog, severity, args) {
    if (!jsonLogging) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        consoleLog(...args);
        return;
    }
    if (args.length == 0) {
        // console.xyz()
        return;
    }
    let context;
    let message;
    let error;
    let payloadArgs;
    if (args[0] instanceof Error) {
        // console.xyz(Error, ...any) / log.xyz(Error) / log.xyz(Error, LogPayload)
        error = args[0];
        payloadArgs = args.slice(1);
    }
    else if (typeof args[0] === "string") {
        message = args[0];
        if (args.length < 2 || !(args[1] instanceof Error)) {
            // console.xyz(string) / console.xyz(string, !Error, ...any) / log.xyz(string) / log.xyz(string, LogPayload)
            payloadArgs = args.slice(1);
        }
        else {
            // console.xyz(string, Error, ...any) / log.xyz(string, Error) / log.xyz(string, Error, LogPayload)
            error = args[1];
            payloadArgs = args.slice(2);
        }
    }
    else if (calledViaConsole || args.length < 2) {
        // console.xyz(!string & !Error, ...any) / wrong call of log.xyz (can happen when juggling with 'any'
        // or when passing, by mistake, log.xyz instead of console.xyz to third-party code as a callback (*))
        payloadArgs = args;
    }
    else {
        context = args[0] instanceof Object ? args[0] : undefined;
        if (args[1] instanceof Error) {
            // log.xyz(LogContext, Error) / log.xyz(LogContext, Error, LogPayload)
            error = args[1];
            payloadArgs = args.slice(2);
        }
        else if (typeof args[1] === "string") {
            message = args[1];
            if (args.length < 3 || !(args[2] instanceof Error)) {
                // log.xyz(LogContext, string) / log.xyz(LogContext, string, LogPayload)
                payloadArgs = args.slice(2);
            }
            else {
                // log.xyz(LogContext, string, Error) / log.xyz(LogContext, string, Error, LogPayload)
                error = args[2];
                payloadArgs = args.slice(3);
            }
        }
        else {
            // wrong call of log.xyz (see (*) above)
            context = undefined;
            payloadArgs = args;
        }
    }
    const logItem = makeLogItem(severity, context, message, error, payloadArgs, calledViaConsole);
    if (logItem !== undefined) {
        consoleLog(logItem);
    }
}
function makeLogItem(severity, context, message, error, payloadArgs, calledViaConsole) {
    if (context !== undefined && Object.keys(context).length == 0) {
        context = undefined;
    }
    context = logContextAugmenter(context);
    context = scrubPayload(context, plainLogging);
    let reportedErrorEvent = {};
    if (GoogleLogSeverity.isGreaterOrEqualThanWarning(severity)) {
        reportedErrorEvent = makeReportedErrorEvent(error);
    }
    payloadArgs = payloadArgs.map((arg) => scrubPayload(arg, plainLogging));
    const payload = payloadArgs.length == 0 ? undefined : payloadArgs.length == 1 ? payloadArgs[0] : payloadArgs;
    const logItem = {
        // undefined fields get eliminated in JSON.stringify()
        ...reportedErrorEvent,
        component,
        severity,
        time: new Date().toISOString(),
        context,
        message,
        error,
        payload,
        loggedViaConsole: calledViaConsole ? true : undefined,
    };
    if (logItemHook) {
        try {
            logItemHook(logItem);
        }
        catch (err) { }
    }
    if (plainLogging) {
        return `[${logItem.severity}] [${logItem.component}] ${logItem.message}
            ${JSON.stringify(payload || "", undefined, "              ")}
            ${error || ""}
        `.trim();
    }
    let result = stringifyLogItem(logItem);
    if (result.length > maxAllowedLogItemLength && payload !== undefined) {
        delete logItem.payload;
        (logItem).payloadStub = `Payload stripped as log item was longer than ${maxAllowedLogItemLength} characters`;
        result = stringifyLogItem(logItem);
        if (result.length <= maxAllowedLogItemLength) {
            log.warn("Log item too large, stripping payload", { logItemStub: makeLogItemStub(logItem) });
        }
    }
    if (result.length > maxAllowedLogItemLength) {
        log.error("Log item too large w/o payload, discarding", { logItemStub: makeLogItemStub(logItem) });
        return undefined;
    }
    return result;
}
function scrubPayload(payload, plainLogging) {
    if (plainLogging) {
        return payload;
    }
    return scrubbing_1.scrubber.scrub(payload, false);
}
// See https://cloud.google.com/error-reporting/docs/formatting-error-messages
// and https://cloud.google.com/error-reporting/reference/rest/v1beta1/projects.events/report#ReportedErrorEvent
function makeReportedErrorEvent(error) {
    const result = {
        // Serves as marker only
        "@type": "type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent",
        // This is useful for filtering in the UI
        serviceContext: {
            service: component || "<ts-not-set>",
            version: version || "<ts-not-set>",
        },
        // According to: https://cloud.google.com/error-reporting/docs/formatting-error-messages#json_representation
        stack_trace: error === null || error === void 0 ? void 0 : error.stack,
    };
    return result;
}
function makeLogItemStub(logItem) {
    const result = {
        component: logItem.component,
        severity: logItem.severity,
        time: logItem.time,
        environment: logItem.environment,
        region: logItem.region,
    };
    if (typeof logItem.message === "string") {
        if (logItem.message.length <= maxMessageStubLength) {
            result.message = logItem.message;
        }
        else {
            result.messageStub = logItem.message.substring(0, maxMessageStubLength) + " ... (too long, truncated)";
        }
    }
    if (logItem.error instanceof Error && logItem.error.stack) {
        if (logItem.error.stack.length <= maxErrorStubLength) {
            result.error = logItem.error.stack;
        }
        else {
            result.errorStub = logItem.error.stack.substring(0, maxErrorStubLength) + " ... (too long, truncated)";
        }
    }
    return result;
}
function stringifyLogItem(logItem) {
    try {
        return jsonStringifyWithErrors(logItem);
    }
    catch (err) {
        if (err instanceof TypeError && logItem.payload !== undefined) {
            // payload contains circular references: save it as a string in the form console.xyz() would print
            logItem.payload = inspect(logItem.payload);
            return jsonStringifyWithErrors(logItem);
        }
        throw err;
    }
}
/**
 * Jsonifies Errors properly, not as {} only.
 */
function jsonStringifyWithErrors(value) {
    return JSON.stringify(value, (_, value) => {
        return value instanceof Error ? value.stack : value;
    });
}
const logConsoleLog = console.log;
const errorConsoleLog = console.error;
const warnConsoleLog = console.warn;
const infoConsoleLog = console.info;
const debugConsoleLog = console.debug;
// according to https://cloud.google.com/logging/quotas#logging_usage_limits, the log item must fit in 100 KB (internal data
// size; its relation to the stringified JSON's size is unknown), so let's have a sufficient safe margin
const maxAllowedLogItemLength = 32 * 1024;
const maxMessageStubLength = 1024;
const maxErrorStubLength = 4096;
//# sourceMappingURL=logging.js.map