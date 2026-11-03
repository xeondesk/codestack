/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import * as http from "http";
import express from "express";
import { LogrusLogLevel } from "./logging";
export interface SetLogLevelRequest {
    level: LogrusLogLevel;
}
export declare namespace SetLogLevelRequest {
    function is(o: any): o is SetLogLevelRequest;
}
export declare class DebugApp {
    protected _app: express.Application;
    protected httpServer: http.Server | undefined;
    ctor(): void;
    create(): express.Application;
    start(port?: number): void;
    stop(): Promise<void>;
    get app(): express.Application;
}
//# sourceMappingURL=debug-app.d.ts.map