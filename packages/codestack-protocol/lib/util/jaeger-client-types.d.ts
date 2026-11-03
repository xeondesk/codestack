/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { opentracing } from "jaeger-client";
export interface TracingConfig {
    serviceName?: string;
    disable?: boolean;
    sampler?: SamplerConfig;
    reporter?: ReporterConfig;
}
export interface TracingOptions {
    reporter?: Reporter;
    metrics?: MetricsFactory;
    logger?: Logger;
    tags?: any;
}
export interface ReporterConfig {
    logSpans?: boolean;
    agentHost?: string;
    agentPort?: number;
    flushIntervalMs?: number;
}
export interface SamplerConfig {
    type: string;
    param: number;
    host?: string;
    port?: number;
    refreshIntervalMs?: number;
}
export interface Logger {
    info(msg: string): void;
    error(msg: string): void;
}
export interface Reporter {
    report(span: opentracing.Span): void;
    close(callback?: () => void): void;
    setProcess(serviceName: string, tags: any): void;
}
export interface MetricsFactory {
    createCounter(name: string, tags: any): Counter;
    createTimer(name: string, tags: any): Timer;
    createGauge(name: string, tags: any): Gauge;
}
export interface Counter {
    increment(delta: number): void;
}
export interface Timer {
    record(value: number): void;
}
export interface Gauge {
    update(value: number): void;
}
export interface SamplingDecision {
    sample: boolean;
    retryable: boolean;
    tags: any;
}
export interface Sampler {
    name(): string;
    isSampled(operation: string, tags: any): boolean;
    onCreateSpan(span: opentracing.Span): SamplingDecision;
    onSetOperationName(span: opentracing.Span, operationName: string): SamplingDecision;
    onSetTag(span: opentracing.Span, key: string, value: any): SamplingDecision;
    close(callback: () => void): void;
}
//# sourceMappingURL=jaeger-client-types.d.ts.map