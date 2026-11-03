/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import * as grpc from "@grpc/grpc-js";
export declare const defaultGRPCOptions: {
    "grpc.keepalive_timeout_ms": number;
    "grpc.keepalive_time_ms": number;
    "grpc.http2.min_time_between_pings_ms": number;
    "grpc.keepalive_permit_without_calls": number;
    "grpc-node.max_session_memory": number;
    "grpc.max_reconnect_backoff_ms": number;
    "grpc.max_receive_message_length": number;
    "grpc.dns_min_time_between_resolutions_ms": number;
};
export type GrpcMethodType = "unary" | "client_stream" | "server_stream" | "bidi_stream";
export interface IGrpcCallMetricsLabels {
    service: string;
    method: string;
    type: GrpcMethodType;
}
export interface IGrpcCallMetricsLabelsWithCode extends IGrpcCallMetricsLabels {
    code: string;
}
export declare const IClientCallMetrics: unique symbol;
export interface IClientCallMetrics {
    started(labels: IGrpcCallMetricsLabels): void;
    sent(labels: IGrpcCallMetricsLabels): void;
    received(labels: IGrpcCallMetricsLabels): void;
    handled(labels: IGrpcCallMetricsLabelsWithCode): void;
    startHandleTimer(labels: IGrpcCallMetricsLabels): (labels?: Partial<Record<string, string | number>> | undefined) => number;
}
export declare function getGrpcMethodType(requestStream: boolean, responseStream: boolean): GrpcMethodType;
export declare function createClientCallMetricsInterceptor(metrics: IClientCallMetrics): grpc.Interceptor;
export declare function createDebugLogInterceptor(additionalContextF: (() => object) | undefined): grpc.Interceptor;
export declare function isGrpcError(err: any): err is grpc.StatusObject;
export declare function isConnectionAlive(client: grpc.Client): boolean;
//# sourceMappingURL=grpc.d.ts.map