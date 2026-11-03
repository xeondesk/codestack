"use strict";
/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDEFrontendDashboardService = void 0;
/**
 * IDEFrontendDashboardService enables IDE related communications
 * between the workspace to codestack origins. Use it to communicate
 * between IDE and dashboard iframes, never use
 * `window.postMessage` directly.
 *
 * **Security Note**: never expose information about other workspaces
 * or sensitive information for the current workspace, i.e. owner token.
 */
var IDEFrontendDashboardService;
(function (IDEFrontendDashboardService) {
    function isInfoUpdateEventData(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-info-update";
    }
    IDEFrontendDashboardService.isInfoUpdateEventData = isInfoUpdateEventData;
    function isFeatureFlagsUpdateEventData(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-feature-flag-update";
    }
    IDEFrontendDashboardService.isFeatureFlagsUpdateEventData = isFeatureFlagsUpdateEventData;
    function isFeatureFlagsRequestEventData(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-feature-flag-request";
    }
    IDEFrontendDashboardService.isFeatureFlagsRequestEventData = isFeatureFlagsRequestEventData;
    function isHeartbeatEventData(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-heartbeat";
    }
    IDEFrontendDashboardService.isHeartbeatEventData = isHeartbeatEventData;
    function isTrackEventData(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-track-event";
    }
    IDEFrontendDashboardService.isTrackEventData = isTrackEventData;
    function isRelocateEventData(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-relocate";
    }
    IDEFrontendDashboardService.isRelocateEventData = isRelocateEventData;
    function isSetStateEventData(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-set-state";
    }
    IDEFrontendDashboardService.isSetStateEventData = isSetStateEventData;
    function isOpenBrowserIDE(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-open-browser";
    }
    IDEFrontendDashboardService.isOpenBrowserIDE = isOpenBrowserIDE;
    function isOpenDesktopIDE(obj) {
        return obj != null && typeof obj === "object" && obj.type === "ide-open-desktop";
    }
    IDEFrontendDashboardService.isOpenDesktopIDE = isOpenDesktopIDE;
})(IDEFrontendDashboardService || (exports.IDEFrontendDashboardService = IDEFrontendDashboardService = {}));
//# sourceMappingURL=frontend-dashboard-service.js.map