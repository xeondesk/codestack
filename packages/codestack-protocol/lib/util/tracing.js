"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerOperationSampler = exports.TracingManager = exports.TraceContext = void 0;
const opentracing = __importStar(require("opentracing"));
const jaeger_client_1 = require("jaeger-client");
const opentracing_1 = require("opentracing");
const inversify_1 = require("inversify");
const logging_1 = require("./logging");
var TraceContext;
(function (TraceContext) {
    function startSpan(operation, parentCtx) {
        var _a;
        const options = {};
        // references should contain span id.
        // cf. https://github.com/jaegertracing/jaeger-client-node/issues/432
        if (!!(parentCtx === null || parentCtx === void 0 ? void 0 : parentCtx.span)) {
            const ctx = (_a = parentCtx === null || parentCtx === void 0 ? void 0 : parentCtx.span) === null || _a === void 0 ? void 0 : _a.context();
            if (ctx && !!ctx.toTraceId() && !!ctx.toSpanId()) {
                options.references = [opentracing.followsFrom(ctx)];
            }
        }
        return opentracing.globalTracer().startSpan(operation, options);
    }
    TraceContext.startSpan = startSpan;
    function childContext(operation, parentCtx) {
        const span = startSpan(operation, parentCtx);
        return { span };
    }
    TraceContext.childContext = childContext;
    function withSpan(operation, callback, ctx) {
        // if we don't have a parent span, don't create a trace here as those <trace-without-root-spans> are not useful.
        if (!ctx || !ctx.span || !ctx.span.context()) {
            callback({});
            return;
        }
        const span = TraceContext.startSpan(operation, ctx);
        try {
            callback({ span });
        }
        catch (e) {
            TraceContext.setError({ span }, e);
            throw e;
        }
        finally {
            span.finish();
        }
    }
    TraceContext.withSpan = withSpan;
    function setError(ctx, err) {
        if (!ctx.span) {
            return;
        }
        TraceContext.addNestedTags(ctx, {
            error: {
                message: err.message,
                stacktrace: err.stack,
            },
        });
        ctx.span.setTag("error", true);
    }
    TraceContext.setError = setError;
    function setJsonRPCMetadata(ctx, method) {
        if (!ctx.span) {
            return;
        }
        const tags = {
            rpc: {
                system: "jsonrpc",
                //  version,
            },
        };
        if (method) {
            tags.rpc.method = method;
        }
        addNestedTags(ctx, tags);
    }
    TraceContext.setJsonRPCMetadata = setJsonRPCMetadata;
    function setJsonRPCError(ctx, method, err, withStatusCode = false) {
        if (!ctx.span) {
            return;
        }
        // not use setError bc this is (most likely) a working operation
        setJsonRPCMetadata(ctx, method);
        // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/rpc.md#json-rpc
        addNestedTags(ctx, {
            rpc: {
                jsonrpc: {
                    error_code: err.code,
                    error_message: err.message,
                },
            },
        });
        // the field "status_code" is used by honeycomb to derive insights like success rate, etc. Defaults to "0".
        if (withStatusCode) {
            ctx.span.setTag("status_code", err.code);
        }
    }
    TraceContext.setJsonRPCError = setJsonRPCError;
    function addJsonRPCParameters(ctx, params) {
        if (!ctx.span) {
            return;
        }
        setJsonRPCMetadata(ctx);
        addNestedTags(ctx, {
            rpc: {
                jsonrpc: {
                    parameters: params,
                },
            },
        });
    }
    TraceContext.addJsonRPCParameters = addJsonRPCParameters;
    /**
     * Does what one would expect from `span.addTags`: Calls `span.addTag` for all keys in map, recursively for objects.
     * Example:
     * ```
     * TraceContext.addNestedTags(ctx, {
     *    rpc: {
     *       system: "jsonrpc",
     *       jsonrpc: {
     *          version: "1.0",
     *          method: "test",
     *          parameters: ["abc", "def"],
     *       },
     *    },
     * });
     * ```
     * gives
     * rpc.system = "jsonrpc"
     * rpc.jsonrpc.version = "1.0"
     * rpc.jsonrpc.method = "test"
     * rpc.jsonrpc.parameters.0 = "abc"
     * rpc.jsonrpc.parameters.1 = "def"
     * @param ctx
     * @param keyValueMap
     * @returns
     */
    function addNestedTags(ctx, keyValueMap, _namespace) {
        if (!ctx.span) {
            return;
        }
        const namespace = _namespace ? `${_namespace}.` : "";
        try {
            for (const k of Object.keys(keyValueMap)) {
                const v = keyValueMap[k];
                if (v instanceof Object) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    addNestedTags(ctx, v, `${namespace}${k}`);
                }
                else {
                    ctx.span.setTag(`${namespace}${k}`, v);
                }
            }
        }
        catch (err) {
            // general resilience against odd shapes/parameters
            logging_1.log.error("Tracing.addNestedTags", err, { namespace });
        }
    }
    TraceContext.addNestedTags = addNestedTags;
    function setOWI(ctx, owi) {
        if (!ctx.span) {
            return;
        }
        addNestedTags(ctx, {
            context: owi,
        });
    }
    TraceContext.setOWI = setOWI;
    function finishOnce(span) {
        let done = false;
        return () => {
            if (done)
                return;
            span.finish();
            done = true;
        };
    }
    TraceContext.finishOnce = finishOnce;
})(TraceContext || (exports.TraceContext = TraceContext = {}));
let TracingManager = class TracingManager {
    setup(serviceName, opts) {
        (0, opentracing_1.initGlobalTracer)(this.getTracerForService(serviceName, opts));
    }
    getTracerForService(serviceName, opts) {
        const config = {
            disable: false,
            reporter: {
                logSpans: false,
            },
            serviceName,
        };
        const t = (0, jaeger_client_1.initTracerFromEnv)(config, {
            logger: console,
            tags: {
                "service.build.commit": process.env.CODESTACK_BUILD_GIT_COMMIT,
                "service.build.version": process.env.CODESTACK_BUILD_VERSION,
            },
        });
        if (opts) {
            if (opts.perOpSampling) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                t._sampler = new PerOperationSampler(t._sampler, opts.perOpSampling);
            }
        }
        return t;
    }
};
exports.TracingManager = TracingManager;
exports.TracingManager = TracingManager = __decorate([
    (0, inversify_1.injectable)()
], TracingManager);
class PerOperationSampler {
    constructor(fallback, strategies) {
        this.fallback = fallback;
        this.strategies = strategies;
    }
    name() {
        return "PerOperationSampler";
    }
    toString() {
        return `${this.name()}`;
    }
    isSampled(operation, tags) {
        const shouldSample = this.strategies[operation];
        if (shouldSample === undefined) {
            if (!this.fallback.isSampled) {
                return false;
            }
            return this.fallback.isSampled(operation, tags);
        }
        return shouldSample;
    }
    onCreateSpan(span) {
        const outTags = {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const isSampled = this.isSampled(span.operationName, outTags);
        // NB: return retryable=true here since we can change decision after setOperationName().
        return { sample: isSampled, retryable: true, tags: outTags };
    }
    onSetOperationName(span, operationName) {
        const outTags = {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const isSampled = this.isSampled(span.operationName, outTags);
        return { sample: isSampled, retryable: false, tags: outTags };
    }
    onSetTag(span, key, value) {
        return { sample: false, retryable: true, tags: null };
    }
    equal(other) {
        return false; // TODO equal should be removed
    }
    close(callback) {
        // all nested samplers are of simple types, so we do not need to Close them
        if (callback) {
            callback();
        }
    }
}
exports.PerOperationSampler = PerOperationSampler;
//# sourceMappingURL=tracing.js.map