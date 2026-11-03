/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { PrebuiltWorkspaceState, Workspace, WorkspaceClasses } from "./protocol";
import { DeepPartial } from "./util/deep-partial";
import { WorkspaceInstance } from "./workspace-instance";
export interface ProjectConfig {
    ".codestack.yml": string;
}
export interface ProjectSettings {
    /**
     * Controls settings of prebuilds for this project.
     */
    prebuilds?: PrebuildSettings;
    workspaceClasses?: WorkspaceClasses;
    /**
     * Controls workspace class restriction for this project, the list is a NOT ALLOW LIST. Empty array to allow all kind of workspace classes
     */
    restrictedWorkspaceClasses?: string[];
    restrictedEditorNames?: string[];
    /**
     * Enable automatic authentication for docker daemon with all credentials specified in CODESTACK_IMAGE_AUTH
     */
    enableDockerdAuthentication?: boolean;
}
export declare namespace PrebuildSettings {
    type BranchStrategy = "default-branch" | "all-branches" | "matched-branches";
    type TriggerStrategy = "activity-based" | "webhook-based";
    interface CloneSettings {
        fullClone?: boolean;
    }
}
export interface PrebuildSettings {
    enable?: boolean;
    /**
     * Defines an interval of commits to run new prebuilds for. Defaults to 20
     */
    prebuildInterval?: number;
    /**
     * Which branches to consider to run new prebuilds on. Default to "all-branches"
     */
    branchStrategy?: PrebuildSettings.BranchStrategy;
    /**
     * If `branchStrategy` s set to "matched-branches", this should define a glob-pattern to be used
     * to match the branch to run new prebuilds on. Defaults to "**"
     */
    branchMatchingPattern?: string;
    /**
     * Preferred workspace class for prebuilds.
     */
    workspaceClass?: string;
    /**
     * The activation strategy for prebuilds. Defaults to "webhook-based"
     */
    triggerStrategy?: PrebuildSettings.TriggerStrategy;
    cloneSettings?: PrebuildSettings.CloneSettings;
}
export interface Project {
    id: string;
    name: string;
    cloneUrl: string;
    teamId: string;
    appInstallationId: string;
    settings?: ProjectSettings;
    creationTime: string;
    markedDeleted?: boolean;
}
export declare namespace Project {
    function is(data?: any): data is Project;
    const create: (project: Omit<Project, "id" | "creationTime">) => Project;
    type PrebuildSettingsWithDefaults = Required<Pick<PrebuildSettings, "prebuildInterval">> & PrebuildSettings;
    const PREBUILD_SETTINGS_DEFAULTS: PrebuildSettingsWithDefaults;
    /**
     * Returns effective prebuild settings for the given project. The resulting settings
     * contain default values for properties which are not set explicitly for this project.
     */
    function getPrebuildSettings(project: Project): PrebuildSettingsWithDefaults;
    function hasPrebuildSettings(project: Project): boolean;
    interface Overview {
        branches: BranchDetails[];
        isConsideredInactive?: boolean;
    }
    namespace Overview {
        function is(data?: any): data is Project.Overview;
    }
    interface BranchDetails {
        name: string;
        url: string;
        isDefault: boolean;
        changeTitle: string;
        changeDate?: string;
        changeAuthor?: string;
        changeAuthorAvatar?: string;
        changePR?: string;
        changeUrl?: string;
        changeHash: string;
    }
    type Visibility = "public" | "org-public" | "private";
}
export type PartialProject = DeepPartial<Project> & Pick<Project, "id">;
export interface ProjectUsage {
    lastWebhookReceived: string;
    lastWorkspaceStart: string;
}
export interface PrebuildWithStatus {
    info: PrebuildInfo;
    status: PrebuiltWorkspaceState;
    workspace: Workspace;
    instance?: WorkspaceInstance;
    error?: string;
}
export interface PrebuildInfo {
    id: string;
    buildWorkspaceId: string;
    basedOnPrebuildId?: string;
    teamId?: string;
    userId?: string;
    projectId: string;
    projectName: string;
    cloneUrl: string;
    branch: string;
    startedAt: string;
    startedBy: string;
    startedByAvatar?: string;
    changeTitle: string;
    changeDate: string;
    changeAuthor: string;
    changeAuthorAvatar?: string;
    changePR?: string;
    changeUrl?: string;
    changeHash: string;
}
export declare namespace PrebuildInfo {
    function is(data?: any): data is PrebuildInfo;
}
export interface StartPrebuildResult {
    prebuildId: string;
    wsid: string;
    done: boolean;
}
export type Team = Organization;
export interface Organization {
    id: string;
    name: string;
    slug?: string;
    creationTime: string;
    markedDeleted?: boolean;
    maintenanceMode?: boolean;
    maintenanceNotification?: MaintenanceNotification;
}
export interface MaintenanceNotification {
    enabled: boolean;
    message?: string;
}
export interface OrganizationSettings {
    workspaceSharingDisabled?: boolean;
    defaultWorkspaceImage?: string;
    allowedWorkspaceClasses?: string[];
    pinnedEditorVersions?: {
        [key: string]: string;
    };
    restrictedEditorNames?: string[];
    defaultRole?: OrgMemberRole;
    timeoutSettings?: TimeoutSettings;
    roleRestrictions?: RoleRestrictions;
    maxParallelRunningWorkspaces?: number;
    onboardingSettings?: OnboardingSettings;
    annotateGitCommits?: boolean;
}
export type TimeoutSettings = {
    inactivity?: string;
    denyUserTimeouts?: boolean;
};
export declare const VALID_ORG_MEMBER_ROLES: readonly ["owner", "member", "collaborator"];
export type TeamMemberRole = OrgMemberRole;
export type OrgMemberRole = typeof VALID_ORG_MEMBER_ROLES[number];
export type OrgMemberPermission = "start_arbitrary_repositories";
export type RoleRestrictions = Partial<Record<OrgMemberRole, OrgMemberPermission[]>>;
export declare namespace TeamMemberRole {
    function isValid(role: unknown): role is TeamMemberRole;
}
export interface OnboardingSettings {
    /**
     * the link to an internal onboarding page for the organization, possibly featuring a custom onboarding guide and other resources
     */
    internalLink?: string;
    /**
     * the repository IDs of the repositories that are recommended for members to start with
     */
    recommendedRepositories?: string[];
    /**
     * the welcome message for new members of the organization
     */
    welcomeMessage?: WelcomeMessage;
}
export interface WelcomeMessage {
    enabled?: boolean;
    featuredMemberId?: string;
    featuredMemberResolvedAvatarUrl?: string;
    message?: string;
}
export type TeamMemberInfo = OrgMemberInfo;
export interface OrgMemberInfo {
    userId: string;
    fullName?: string;
    primaryEmail?: string;
    avatarUrl?: string;
    role: TeamMemberRole;
    memberSince: string;
    ownedByOrganization: boolean;
}
export interface TeamMembershipInvite {
    id: string;
    teamId: string;
    role: TeamMemberRole;
    creationTime: string;
    invalidationTime: string;
    invitedEmail?: string;
    /** This is a flag that triggers the HARD DELETION of this entity */
    deleted?: boolean;
}
//# sourceMappingURL=teams-projects-protocol.d.ts.map