import { Interceptor } from "@connectrpc/connect";
export declare function getMetricsInterceptor(): Interceptor;
export type MetricsRequest = RequestInit & {
    url: string;
};
export declare class MetricsReporter {
    private readonly options;
    private static readonly REPORT_INTERVAL;
    private intervalHandler;
    private readonly metricsHost;
    private sendQueue;
    private readonly pendingRequests;
    constructor(options: {
        codestackUrl: string;
        clientName: string;
        clientVersion: string;
        log: {
            error: typeof console.error;
            debug: typeof console.debug;
        };
        isEnabled?: () => Promise<boolean>;
        commonErrorDetails: {
            [key: string]: string | undefined;
        };
    });
    updateCommonErrorDetails(update: {
        [key: string]: string | undefined;
    }): void;
    startReporting(): void;
    stopReporting(): void;
    private isEnabled;
    private report;
    private syncReportCounter;
    private syncReportHistogram;
    reportError(error: Error, data?: {
        userId?: string;
        workspaceId?: string;
        instanceId?: string;
        [key: string]: string | undefined;
    }): void;
    private asyncReportError;
    private create;
    private push;
    private send;
    instrumentWebSocket(ws: WebSocket, origin: string): void;
}
//# sourceMappingURL=metrics.d.ts.map