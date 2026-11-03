/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export declare enum HeadlessWorkspaceEventType {
    LogOutput = "log-output",
    FinishedSuccessfully = "finish-success",
    FinishedButFailed = "finish-fail",
    AbortedTimedOut = "aborted-timeout",
    Aborted = "aborted",
    Failed = "failed",
    Started = "started"
}
export declare namespace HeadlessWorkspaceEventType {
    function isRunning(t: HeadlessWorkspaceEventType): t is HeadlessWorkspaceEventType.LogOutput;
    function didFinish(t: HeadlessWorkspaceEventType): t is HeadlessWorkspaceEventType.FinishedSuccessfully | HeadlessWorkspaceEventType.FinishedButFailed;
}
export interface HeadlessWorkspaceEvent {
    workspaceID: string;
    type: HeadlessWorkspaceEventType;
}
export interface HeadlessLogUrls {
    streams: {
        [streamID: string]: string;
    };
    online?: boolean;
}
/** cmp. @const HEADLESS_LOG_STREAM_STATUS_CODE_REGEX */
export declare const HEADLESS_LOG_STREAM_STATUS_CODE = "X-LogStream-StatusCode";
export declare const HEADLESS_LOG_STREAM_STATUS_CODE_REGEX: RegExp;
//# sourceMappingURL=headless-workspace-log.d.ts.map