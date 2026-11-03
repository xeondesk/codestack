/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import * as prometheusClient from "prom-client";
import { IClientCallMetrics, IGrpcCallMetricsLabels, IGrpcCallMetricsLabelsWithCode } from "../util/grpc";
export declare class PrometheusClientCallMetrics implements IClientCallMetrics {
    readonly startedCounter: prometheusClient.Counter<string>;
    readonly sentCounter: prometheusClient.Counter<string>;
    readonly receivedCounter: prometheusClient.Counter<string>;
    readonly handledCounter: prometheusClient.Counter<string>;
    readonly handledSecondsHistogram: prometheusClient.Histogram<string>;
    constructor();
    dispose(): void;
    started(labels: IGrpcCallMetricsLabels): void;
    sent(labels: IGrpcCallMetricsLabels): void;
    received(labels: IGrpcCallMetricsLabels): void;
    handled(labels: IGrpcCallMetricsLabelsWithCode): void;
    startHandleTimer(labels: IGrpcCallMetricsLabelsWithCode): (labels?: Partial<Record<string, string | number>> | undefined) => number;
}
//# sourceMappingURL=client-call-metrics.d.ts.map