/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import * as opentracing from "opentracing";
import { Sampler, SamplingDecision } from "./jaeger-client-types";
import { LogContext } from "./logging";
export interface TraceContext {
    span?: opentracing.Span;
    isDebugIDContainerOnly?: () => boolean;
}
export type TraceContextWithSpan = TraceContext & {
    span: opentracing.Span;
};
export declare namespace TraceContext {
    function startSpan(operation: string, parentCtx?: TraceContext): opentracing.Span;
    function childContext(operation: string, parentCtx: TraceContext): TraceContextWithSpan;
    function withSpan(operation: string, callback: (ctx: TraceContext) => void, ctx?: TraceContext): void;
    function setError(ctx: TraceContext, err: any): void;
    function setJsonRPCMetadata(ctx: TraceContext, method?: string): void;
    function setJsonRPCError(ctx: TraceContext, method: string, err: Error & {
        code: number;
    }, withStatusCode?: boolean): void;
    function addJsonRPCParameters(ctx: TraceContext, params: {
        [key: string]: any;
    }): void;
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
    function addNestedTags(ctx: TraceContext, keyValueMap: {
        [key: string]: any;
    }, _namespace?: string): void;
    function setOWI(ctx: TraceContext, owi: LogContext): void;
    function finishOnce(span: opentracing.Span): () => void;
}
export declare class TracingManager {
    setup(serviceName: string, opts?: CustomTracerOpts): void;
    getTracerForService(serviceName: string, opts?: CustomTracerOpts): import("jaeger-client").JaegerTracer;
}
export interface CustomTracerOpts {
    perOpSampling?: PerOperationSampling;
}
export interface PerOperationSampling {
    [key: string]: boolean;
}
export declare class PerOperationSampler implements Sampler {
    protected readonly fallback: Sampler;
    protected readonly strategies: PerOperationSampling;
    constructor(fallback: Sampler, strategies: PerOperationSampling);
    name(): string;
    toString(): string;
    isSampled(operation: string, tags: any): boolean;
    onCreateSpan(span: opentracing.Span): SamplingDecision;
    onSetOperationName(span: opentracing.Span, operationName: string): SamplingDecision;
    onSetTag(span: opentracing.Span, key: string, value: any): SamplingDecision;
    equal(other: Sampler): boolean;
    close(callback: () => void): void;
}
type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true;
type AddTraceContext<T> = T extends (a: infer A, b: infer B, c: infer C, d: infer D, e: infer E, f: infer F) => infer R ? IsValidArg<F> extends true ? (ctx: TraceContextWithSpan, a: A, b: B, c: C, d: D, e: E, f: F) => R : IsValidArg<E> extends true ? (ctx: TraceContextWithSpan, a: A, b: B, c: C, d: D, e: E) => R : IsValidArg<D> extends true ? (ctx: TraceContextWithSpan, a: A, b: B, c: C, d: D) => R : IsValidArg<C> extends true ? (ctx: TraceContextWithSpan, a: A, b: B, c: C) => R : IsValidArg<B> extends true ? (ctx: TraceContextWithSpan, a: A, b: B) => R : IsValidArg<A> extends true ? (ctx: TraceContextWithSpan, a: A) => R : (ctx: TraceContextWithSpan) => Promise<R> : never;
export type InterfaceWithTraceContext<T> = {
    [P in keyof T]: AddTraceContext<T[P]>;
};
export {};
//# sourceMappingURL=tracing.d.ts.map