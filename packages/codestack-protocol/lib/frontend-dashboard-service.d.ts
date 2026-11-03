/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { WorkspaceInstancePhase } from "./workspace-instance";
import { RemoteTrackMessage } from "./analytics";
/**
 * IDEFrontendDashboardService enables IDE related communications
 * between the workspace to codestack origins. Use it to communicate
 * between IDE and dashboard iframes, never use
 * `window.postMessage` directly.
 *
 * **Security Note**: never expose information about other workspaces
 * or sensitive information for the current workspace, i.e. owner token.
 */
export declare namespace IDEFrontendDashboardService {
    /**
     * IClient is the client side which is using in supervisor frontend
     */
    interface IClient {
        trackEvent(msg: RemoteTrackMessage): void;
        activeHeartbeat(): void;
        setState(state: SetStateData): void;
        openDesktopIDE(url: string): void;
    }
    /**
     * IServer is the server side which is using in dashboard loading screen
     */
    interface IServer {
        relocate(url: string): void;
        sendInfoUpdate(info: Info): void;
        openBrowserIDE(): void;
    }
    /**
     * Info defined the information that `supervisor/frontend` requires.
     */
    interface Info {
        workspaceID: string;
        loggedUserId: string;
        ownerId: string;
        instanceId?: string;
        ideUrl?: string;
        statusPhase?: WorkspaceInstancePhase;
        workspaceDescription: string;
        workspaceType: string;
        credentialsToken: string;
    }
    interface SetStateData {
        ideFrontendFailureCause?: string;
        desktopIDE?: {
            clientID: string;
            link: string;
            label?: string;
        };
    }
    interface InfoUpdateEventData {
        version?: number;
        type: "ide-info-update";
        info: Info;
    }
    interface FeatureFlagsUpdateEventData {
        type: "ide-feature-flag-update";
        flags: {
            supervisor_check_ready_retry: boolean;
        };
    }
    interface FeatureFlagsRequestEventData {
        type: "ide-feature-flag-request";
    }
    interface HeartbeatEventData {
        type: "ide-heartbeat";
    }
    interface TrackEventData {
        type: "ide-track-event";
        msg: RemoteTrackMessage;
    }
    interface RelocateEventData {
        type: "ide-relocate";
        url: string;
    }
    interface SetStateEventData {
        type: "ide-set-state";
        state: SetStateData;
    }
    interface OpenBrowserIDE {
        type: "ide-open-browser";
    }
    interface OpenDesktopIDE {
        type: "ide-open-desktop";
        url: string;
    }
    function isInfoUpdateEventData(obj: any): obj is InfoUpdateEventData;
    function isFeatureFlagsUpdateEventData(obj: any): obj is FeatureFlagsUpdateEventData;
    function isFeatureFlagsRequestEventData(obj: any): obj is FeatureFlagsRequestEventData;
    function isHeartbeatEventData(obj: any): obj is HeartbeatEventData;
    function isTrackEventData(obj: any): obj is TrackEventData;
    function isRelocateEventData(obj: any): obj is RelocateEventData;
    function isSetStateEventData(obj: any): obj is SetStateEventData;
    function isOpenBrowserIDE(obj: any): obj is OpenBrowserIDE;
    function isOpenDesktopIDE(obj: any): obj is OpenDesktopIDE;
}
//# sourceMappingURL=frontend-dashboard-service.d.ts.map