"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
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
exports.IClientCallMetrics = exports.defaultGRPCOptions = void 0;
exports.getGrpcMethodType = getGrpcMethodType;
exports.createClientCallMetricsInterceptor = createClientCallMetricsInterceptor;
exports.createDebugLogInterceptor = createDebugLogInterceptor;
exports.isGrpcError = isGrpcError;
exports.isConnectionAlive = isConnectionAlive;
const grpc = __importStar(require("@grpc/grpc-js"));
const constants_1 = require("@grpc/grpc-js/build/src/constants");
const logging_1 = require("./logging");
const scrubbing_1 = require("./scrubbing");
exports.defaultGRPCOptions = {
    "grpc.keepalive_timeout_ms": 10000,
    "grpc.keepalive_time_ms": 60000,
    "grpc.http2.min_time_between_pings_ms": 10000,
    "grpc.keepalive_permit_without_calls": 1,
    "grpc-node.max_session_memory": 50,
    "grpc.max_reconnect_backoff_ms": 5000,
    "grpc.max_receive_message_length": 1024 * 1024 * 16,
    // default is 30s, which is too long for us during rollouts (where service DNS entries are updated)
    "grpc.dns_min_time_between_resolutions_ms": 2000,
};
exports.IClientCallMetrics = Symbol("IClientCallMetrics");
function getGrpcMethodType(requestStream, responseStream) {
    if (requestStream) {
        if (responseStream) {
            return "bidi_stream";
        }
        else {
            return "client_stream";
        }
    }
    else {
        if (responseStream) {
            return "server_stream";
        }
        else {
            return "unary";
        }
    }
}
function createClientCallMetricsInterceptor(metrics) {
    return (options, nextCall) => {
        const methodDef = options.method_definition;
        const method = methodDef.path.substring(methodDef.path.lastIndexOf("/") + 1);
        const service = methodDef.path.substring(1, methodDef.path.length - method.length - 1);
        const labels = {
            service,
            method,
            type: getGrpcMethodType(options.method_definition.requestStream, options.method_definition.responseStream),
        };
        const requester = new grpc.RequesterBuilder()
            .withStart((metadata, listener, next) => {
            const newListener = new grpc.ListenerBuilder()
                .withOnReceiveStatus((status, next) => {
                try {
                    metrics.handled({
                        ...labels,
                        code: constants_1.Status[status.code],
                    });
                }
                finally {
                    next(status);
                }
            })
                .withOnReceiveMessage((message, next) => {
                try {
                    metrics.received(labels);
                }
                finally {
                    next(message);
                }
            })
                .build();
            try {
                metrics.started(labels);
            }
            finally {
                next(metadata, newListener);
            }
        })
            .withSendMessage((message, next) => {
            try {
                metrics.sent(labels);
            }
            finally {
                next(message);
            }
        })
            .build();
        return new grpc.InterceptingCall(nextCall(options), requester);
    };
}
function createDebugLogInterceptor(additionalContextF) {
    const FAILURE_STATUS_CODES = new Map([
        [constants_1.Status.ABORTED, true],
        [constants_1.Status.CANCELLED, true],
        [constants_1.Status.DATA_LOSS, true],
        [constants_1.Status.DEADLINE_EXCEEDED, true],
        [constants_1.Status.FAILED_PRECONDITION, true],
        [constants_1.Status.INTERNAL, true],
        [constants_1.Status.PERMISSION_DENIED, true],
        [constants_1.Status.RESOURCE_EXHAUSTED, true],
        [constants_1.Status.UNAUTHENTICATED, true],
        [constants_1.Status.UNAVAILABLE, true],
        [constants_1.Status.UNIMPLEMENTED, true],
        [constants_1.Status.UNKNOWN, true],
    ]);
    return (options, nextCall) => {
        const methodDef = options.method_definition;
        const method = methodDef.path.substring(methodDef.path.lastIndexOf("/") + 1);
        const service = methodDef.path.substring(1, methodDef.path.length - method.length - 1);
        const labels = {
            service,
            method,
            type: getGrpcMethodType(options.method_definition.requestStream, options.method_definition.responseStream),
        };
        const requester = new grpc.RequesterBuilder()
            .withStart((metadata, listener, next) => {
            const newListener = new grpc.ListenerBuilder()
                .withOnReceiveStatus((status, next) => {
                // If given, call the additionalContext function and log the result
                let additionalContext = {};
                try {
                    if (additionalContextF) {
                        additionalContext = additionalContextF();
                    }
                }
                catch (e) { }
                try {
                    const info = {
                        labels: new scrubbing_1.TrustedValue(labels),
                        metadata: new scrubbing_1.TrustedValue(metadata.toJSON()),
                        code: constants_1.Status[status.code],
                        details: status.details,
                        additionalContext: new scrubbing_1.TrustedValue(additionalContext),
                    };
                    if (FAILURE_STATUS_CODES.has(status.code)) {
                        logging_1.log.warn(`grpc call failed`, info);
                    }
                    else {
                        logging_1.log.debug(`grpc call status`, info);
                    }
                }
                finally {
                    next(status);
                }
            })
                .build();
            try {
                logging_1.log.debug(`grpc call started`, {
                    labels: new scrubbing_1.TrustedValue(labels),
                    metadata: new scrubbing_1.TrustedValue(metadata.toJSON()),
                });
            }
            finally {
                next(metadata, newListener);
            }
        })
            .withCancel((next) => {
            try {
                logging_1.log.debug(`grpc call cancelled`, { labels: new scrubbing_1.TrustedValue(labels) });
            }
            finally {
                next();
            }
        })
            .build();
        return new grpc.InterceptingCall(nextCall(options), requester);
    };
}
function isGrpcError(err) {
    return err.code && err.details;
}
function isConnectionAlive(client) {
    const cs = client.getChannel().getConnectivityState(false);
    return (cs == grpc.connectivityState.CONNECTING ||
        cs == grpc.connectivityState.IDLE ||
        cs == grpc.connectivityState.READY);
}
//# sourceMappingURL=grpc.js.map