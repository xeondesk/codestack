"use strict";
/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prometheusClientMiddleware = prometheusClientMiddleware;
const abort_controller_x_1 = require("abort-controller-x");
const nice_grpc_common_1 = require("nice-grpc-common");
function getLabels(method) {
    const callType = method.requestStream
        ? method.responseStream
            ? "bidi_stream"
            : "client_stream"
        : method.responseStream
            ? "server_stream"
            : "unary";
    const { path } = method;
    const [serviceName, methodName] = path.split("/").slice(1);
    return {
        type: callType,
        service: serviceName,
        method: methodName,
    };
}
async function* incrementStreamMessagesCounter(iterable, callback) {
    for await (const item of iterable) {
        callback();
        yield item;
    }
}
function prometheusClientMiddleware(metrics) {
    return async function* prometheusClientMiddlewareGenerator(call, options) {
        const labels = getLabels(call.method);
        metrics.started(labels);
        const stopTimer = metrics.startHandleTimer(labels);
        let settled = false;
        let status = nice_grpc_common_1.Status.OK;
        try {
            let request;
            if (!call.requestStream) {
                request = call.request;
            }
            else {
                request = incrementStreamMessagesCounter(call.request, metrics.sent.bind(metrics, labels));
            }
            if (!call.responseStream) {
                const response = yield* call.next(request, options);
                settled = true;
                return response;
            }
            else {
                yield* incrementStreamMessagesCounter(call.next(request, options), metrics.received.bind(metrics, labels));
                settled = true;
                return;
            }
        }
        catch (err) {
            settled = true;
            if (err instanceof nice_grpc_common_1.ClientError) {
                status = err.code;
            }
            else if ((0, abort_controller_x_1.isAbortError)(err)) {
                status = nice_grpc_common_1.Status.CANCELLED;
            }
            else {
                status = nice_grpc_common_1.Status.UNKNOWN;
            }
            throw err;
        }
        finally {
            if (!settled) {
                status = nice_grpc_common_1.Status.CANCELLED;
            }
            stopTimer({ grpc_code: nice_grpc_common_1.Status[status] });
            metrics.handled({ ...labels, code: nice_grpc_common_1.Status[status] });
        }
    };
}
//# sourceMappingURL=nice-grpc.js.map