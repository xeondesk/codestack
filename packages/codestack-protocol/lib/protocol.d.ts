/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { WorkspaceInstance, PortVisibility, PortProtocol, WorkspaceInstanceMetrics } from "./workspace-instance";
import { RoleOrPermission } from "./permission";
import { Project } from "./teams-projects-protocol";
import { WorkspaceRegion } from "./workspace-cluster";
export interface UserInfo {
    name?: string;
}
export interface User {
    /** The user id */
    id: string;
    /** The ID of the Organization this user is owned by. If undefined, the user is owned by the installation */
    organizationId?: string;
    /** The timestamp when the user entry was created */
    creationDate: string;
    avatarUrl?: string;
    name?: string;
    /** Optional for backwards compatibility */
    fullName?: string;
    identities: Identity[];
    /**
     * Whether the user has been blocked to use our service, because of TOS violation for example.
     * Optional for backwards compatibility.
     */
    blocked?: boolean;
    /** A map of random settings that alter the behaviour of Codestack on a per-user basis */
    featureFlags?: UserFeatureSettings;
    /** The permissions and/or roles the user has */
    rolesOrPermissions?: RoleOrPermission[];
    /** Whether the user is logical deleted. This flag is respected by all queries in UserDB */
    markedDeleted?: boolean;
    additionalData?: AdditionalUserData;
    usageAttributionId?: string;
    lastVerificationTime?: string;
    verificationPhoneNumber?: string;
    fgaRelationshipsVersion?: number;
}
export declare namespace User {
    function is(data: any): data is User;
    function getIdentity(user: User, authProviderId: string): Identity | undefined;
    function isOrganizationOwned(user: User): boolean;
}
export interface WorkspaceTimeoutSetting {
    workspaceTimeout: string;
    disabledClosedTimeout: boolean;
}
export interface AdditionalUserData extends Partial<WorkspaceTimeoutSetting> {
    /** @deprecated unused */
    platforms?: UserPlatform[];
    emailNotificationSettings?: EmailNotificationSettings;
    featurePreview?: boolean;
    ideSettings?: IDESettings;
    whatsNewSeen?: {
        [key: string]: string;
    };
    oauthClientsApproved?: {
        [key: string]: string;
    };
    /** @deprecated unused */
    knownGitHubOrgs?: string[];
    dotfileRepo?: string;
    workspaceClasses?: WorkspaceClasses;
    profile?: ProfileDetails;
    /** @deprecated */
    shouldSeeMigrationMessage?: boolean;
    workspaceAutostartOptions?: WorkspaceAutostartOption[];
}
export interface WorkspaceAutostartOption {
    cloneURL: string;
    organizationId: string;
    workspaceClass?: string;
    ideSettings?: IDESettings;
    region?: WorkspaceRegion;
}
export declare namespace AdditionalUserData {
    function set(user: User, partialData: Partial<AdditionalUserData>): User;
}
export interface ProfileDetails {
    lastUpdatedDetailsNudge?: string;
    acceptedPrivacyPolicyDate?: string;
    companyName?: string;
    emailAddress?: string;
    jobRole?: string;
    jobRoleOther?: string;
    explorationReasons?: string[];
    signupGoals?: string[];
    signupGoalsOther?: string;
    onboardedTimestamp?: string;
    companySize?: string;
    coachmarksDismissals?: {
        [key: string]: string;
    };
}
export interface EmailNotificationSettings {
    allowsChangelogMail?: boolean;
    allowsDevXMail?: boolean;
    allowsOnboardingMail?: boolean;
}
export type IDESettings = {
    settingVersion?: string;
    defaultIde?: string;
    useLatestVersion?: boolean;
    preferToolbox?: boolean;
    useDesktopIde?: boolean;
    defaultDesktopIde?: string;
};
export interface WorkspaceClasses {
    regular?: string;
    /**
     * @deprecated see Project.settings.prebuilds.workspaceClass
     */
    prebuild?: string;
}
export interface UserPlatform {
    uid: string;
    userAgent: string;
    browser: string;
    os: string;
    lastUsed: string;
    firstUsed: string;
    /**
     * Since when does the user have the browser extension installe don this device.
     */
    browserExtensionInstalledSince?: string;
    /**
     * Since when does the user not have the browser extension installed anymore (but previously had).
     */
    browserExtensionUninstalledSince?: string;
}
export interface UserFeatureSettings {
    /**
     * Permanent feature flags are added to each and every workspace instance
     * this user starts.
     */
    permanentWSFeatureFlags?: NamedWorkspaceFeatureFlag[];
}
export type BillingTier = "paid" | "free";
/**
 * The values of this type MUST MATCH enum values in WorkspaceFeatureFlag from ws-manager/client/core_pb.d.ts
 * If they don't we'll break things during workspace startup.
 */
export declare const WorkspaceFeatureFlags: {
    full_workspace_backup: undefined;
    workspace_class_limiting: undefined;
    workspace_connection_limiting: undefined;
    workspace_psi: undefined;
    ssh_ca: undefined;
};
export type NamedWorkspaceFeatureFlag = keyof typeof WorkspaceFeatureFlags;
export declare namespace NamedWorkspaceFeatureFlag {
    const WORKSPACE_PERSISTED_FEATTURE_FLAGS: NamedWorkspaceFeatureFlag[];
    function isWorkspacePersisted(ff: NamedWorkspaceFeatureFlag): boolean;
}
export type EnvVar = UserEnvVar | ProjectEnvVarWithValue | OrgEnvVarWithValue | EnvVarWithValue;
export interface EnvVarWithValue {
    name: string;
    value: string;
}
export interface ProjectEnvVarWithValue extends EnvVarWithValue {
    id?: string;
    /** If a project-scoped env var is "censored", it is only visible in Prebuilds */
    censored: boolean;
}
export interface ProjectEnvVar extends Omit<ProjectEnvVarWithValue, "value"> {
    id: string;
    projectId: string;
}
export interface OrgEnvVarWithValue extends EnvVarWithValue {
    id?: string;
}
export interface OrgEnvVar extends Omit<OrgEnvVarWithValue, "value"> {
    id: string;
    orgId: string;
}
export interface UserEnvVarValue extends EnvVarWithValue {
    id?: string;
    repositoryPattern: string;
}
export interface UserEnvVar extends UserEnvVarValue {
    id: string;
    userId: string;
    deleted?: boolean;
}
export declare namespace EnvVar {
    const CODESTACK_IMAGE_AUTH_ENV_VAR_NAME = "CODESTACK_IMAGE_AUTH";
    /**
     * - CODESTACK_IMAGE_AUTH is documented https://www.codestack.io/docs/configure/workspaces/workspace-image#use-a-private-docker-image
     */
    const WhiteListFromReserved: string[];
    function is(data: any): data is EnvVar;
    /**
     * Extracts the "host:credentials" pairs from the CODESTACK_IMAGE_AUTH environment variable.
     * @param envVars
     * @returns A map of host to credentials
     */
    function getCodestackImageAuth(envVars: EnvVarWithValue[]): Map<string, string>;
}
export declare namespace UserEnvVar {
    const DELIMITER = "/";
    const WILDCARD_ASTERISK = "*";
    const WILDCARD_DOUBLE_ASTERISK = "**";
    function is(data: any): data is UserEnvVar;
    /**
     * @param variable
     * @returns Either a string containing an error message or undefined.
     */
    function validate(variable: UserEnvVarValue): string | undefined;
    function normalizeRepoPattern(pattern: string): string;
    /**
     * Matches the given EnvVar pattern against the fully qualified name of the repository:
     *  - GitHub: "repo/owner"
     *  - GitLab: "some/nested/repo" (up to MAX_PATTERN_SEGMENTS deep)
     * @param pattern
     * @param repoFqn
     * @returns True if the pattern matches that fully qualified name
     */
    function matchEnvVarPattern(pattern: string, repoFqn: string): boolean;
    function filter<T extends UserEnvVarValue>(vars: T[], owner: string, repo: string): T[];
}
export interface SSHPublicKeyValue {
    name: string;
    key: string;
}
export interface UserSSHPublicKey extends SSHPublicKeyValue {
    id: string;
    key: string;
    userId: string;
    fingerprint: string;
    creationTime: string;
    lastUsedTime?: string;
}
export type UserSSHPublicKeyValue = Omit<UserSSHPublicKey, "userId">;
export declare namespace SSHPublicKeyValue {
    function validate(value: SSHPublicKeyValue): string | undefined;
    function getData(value: SSHPublicKeyValue): {
        type: string;
        key: string;
        email: string | undefined;
    };
    function getFingerprint(value: SSHPublicKeyValue): string;
    const MAXIMUM_KEY_LENGTH = 5;
}
export interface CodestackToken {
    /** Hash value (SHA256) of the token (primary key). */
    tokenHash: string;
    /** Human readable name of the token */
    name?: string;
    /** Token kind */
    type: CodestackTokenType;
    /** The user the token belongs to. */
    userId: string;
    /** Scopes (e.g. limition to read-only) */
    scopes: string[];
    /** Created timestamp */
    created: string;
}
export declare enum CodestackTokenType {
    API_AUTH_TOKEN = 0,
    MACHINE_AUTH_TOKEN = 1
}
export interface OneTimeSecret {
    id: string;
    value: string;
    expirationTime: string;
    deleted: boolean;
}
export interface WorkspaceInstanceUser {
    name?: string;
    avatarUrl?: string;
    instanceId: string;
    userId: string;
    lastSeen: string;
}
export interface Identity {
    authProviderId: string;
    authId: string;
    authName: string;
    primaryEmail?: string;
    /** This is a flag that triggers the HARD DELETION of this entity */
    deleted?: boolean;
    lastSigninTime?: string;
    readonly?: boolean;
}
export type IdentityLookup = Pick<Identity, "authProviderId" | "authId">;
export declare namespace Identity {
    function is(data: any): data is Identity;
    function equals(id1: IdentityLookup, id2: IdentityLookup): boolean;
}
export interface Token {
    value: string;
    scopes: string[];
    updateDate?: string;
    expiryDate?: string;
    reservedUntilDate?: string;
    idToken?: string;
    refreshToken?: string;
    username?: string;
}
export interface TokenEntry {
    uid: string;
    authProviderId: string;
    authId: string;
    token: Token;
    expiryDate?: string;
    reservedUntilDate?: string;
    refreshable?: boolean;
}
export interface EmailDomainFilterEntry {
    domain: string;
    negative: boolean;
}
export type AppInstallationPlatform = "github";
export type AppInstallationState = "claimed.user" | "claimed.platform" | "installed" | "uninstalled";
export interface AppInstallation {
    platform: AppInstallationPlatform;
    installationID: string;
    ownerUserID?: string;
    platformUserID?: string;
    state: AppInstallationState;
    creationTime: string;
    lastUpdateTime: string;
}
export interface PendingGithubEvent {
    id: string;
    githubUserId: string;
    creationDate: Date;
    type: string;
    event: string;
    deleted: boolean;
}
export interface Snapshot {
    id: string;
    creationTime: string;
    availableTime?: string;
    originalWorkspaceId: string;
    bucketId: string;
    state: SnapshotState;
    message?: string;
}
export type SnapshotState = "pending" | "available" | "error";
export interface Workspace {
    id: string;
    creationTime: string;
    organizationId: string;
    contextURL: string;
    description: string;
    ownerId: string;
    projectId?: string;
    context: WorkspaceContext;
    config: WorkspaceConfig;
    /**
     * The source where to get the workspace base image from. This source is resolved
     * during workspace creation. Once a base image has been built the information in here
     * is superseded by baseImageNameResolved.
     */
    imageSource?: WorkspaceImageSource;
    /**
     * The resolved, fix name of the workspace image. We only use this
     * to access the logs during an image build.
     */
    imageNameResolved?: string;
    /**
     * The resolved/built fixed named of the base image. This field is only set if the workspace
     * already has its base image built.
     */
    baseImageNameResolved?: string;
    shareable?: boolean;
    pinned?: boolean;
    readonly deleted?: boolean;
    /**
     * Mark as deleted (user-facing). The actual deletion of the workspace content is executed
     * with a (configurable) delay
     */
    softDeleted?: WorkspaceSoftDeletion;
    /**
     * Marks the time when the workspace was marked as softDeleted. The actual deletion of the
     * workspace content happens after a configurable period
     */
    softDeletedTime?: string;
    /**
     * Marks the time when the workspace content has been deleted.
     */
    contentDeletedTime?: string;
    /**
     * The time when the workspace is eligible for soft deletion. This is the time when the workspace
     * is marked as softDeleted earliest.
     */
    deletionEligibilityTime?: string;
    type: WorkspaceType;
    basedOnPrebuildId?: string;
    basedOnSnapshotId?: string;
}
export type WorkspaceSoftDeletion = "user" | "gc";
export type WorkspaceType = "regular" | "prebuild" | "imagebuild";
export declare namespace Workspace {
    function getPullRequestNumber(ws: Workspace): number | undefined;
    function getIssueNumber(ws: Workspace): number | undefined;
    function getBranchName(ws: Workspace): string | undefined;
    function getCommit(ws: Workspace): string | undefined;
    function fromWorkspaceName(name?: Workspace["description"]): string | undefined;
    function toWorkspaceName(name?: Workspace["description"]): string;
}
export interface GuessGitTokenScopesParams {
    host: string;
    repoUrl: string;
    gitCommand: string;
}
export interface GuessedGitTokenScopes {
    message?: string;
    scopes?: string[];
}
export interface VSCodeConfig {
    extensions?: string[];
}
export interface JetBrainsConfig {
    intellij?: JetBrainsProductConfig;
    goland?: JetBrainsProductConfig;
    pycharm?: JetBrainsProductConfig;
    phpstorm?: JetBrainsProductConfig;
    rubymine?: JetBrainsProductConfig;
    webstorm?: JetBrainsProductConfig;
    rider?: JetBrainsProductConfig;
    clion?: JetBrainsProductConfig;
    rustrover?: JetBrainsProductConfig;
}
export interface JetBrainsProductConfig {
    prebuilds?: JetBrainsPrebuilds;
    vmoptions?: string;
}
export interface JetBrainsPrebuilds {
    version?: "stable" | "latest" | "both";
}
export interface RepositoryCloneInformation {
    url: string;
    checkoutLocation?: string;
}
export interface CoreDumpConfig {
    enabled?: boolean;
    softLimit?: number;
    hardLimit?: number;
}
export interface WorkspaceConfig {
    mainConfiguration?: string;
    additionalRepositories?: RepositoryCloneInformation[];
    image?: ImageConfig;
    ports?: PortConfig[];
    tasks?: TaskConfig[];
    checkoutLocation?: string;
    workspaceLocation?: string;
    gitConfig?: {
        [config: string]: string;
    };
    github?: GithubAppConfig;
    vscode?: VSCodeConfig;
    jetbrains?: JetBrainsConfig;
    coreDump?: CoreDumpConfig;
    ideCredentials?: string;
    env?: {
        [env: string]: any;
    };
    /** deprecated. Enabled by default **/
    experimentalNetwork?: boolean;
    /**
     * Where the config object originates from.
     *
     * repo - from the repository
     * derived - computed based on analyzing the repository
     * additional-content - config comes from additional content, usually provided through the project's configuration
     * default - our static catch-all default config
     */
    _origin?: "repo" | "derived" | "additional-content" | "default";
    /**
     * Set of automatically infered feature flags. That's not something the user can set, but
     * that is set by codestack at workspace creation time.
     */
    _featureFlags?: NamedWorkspaceFeatureFlag[];
}
export interface GithubAppConfig {
    prebuilds?: GithubAppPrebuildConfig;
}
export interface GithubAppPrebuildConfig {
    master?: boolean;
    branches?: boolean;
    pullRequests?: boolean;
    pullRequestsFromForks?: boolean;
    addCheck?: boolean | "prevent-merge-on-error";
    addBadge?: boolean;
    addLabel?: boolean | string;
    addComment?: boolean;
}
export declare namespace GithubAppPrebuildConfig {
    function is(obj: boolean | GithubAppPrebuildConfig): obj is GithubAppPrebuildConfig;
}
export type WorkspaceImageSource = WorkspaceImageSourceDocker | WorkspaceImageSourceReference;
export interface WorkspaceImageSourceDocker {
    dockerFilePath: string;
    dockerFileHash: string;
    dockerFileSource?: Commit;
}
export declare namespace WorkspaceImageSourceDocker {
    function is(obj: object): obj is WorkspaceImageSourceDocker;
}
export interface WorkspaceImageSourceReference {
    /** The resolved, fix base image reference */
    baseImageResolved: string;
}
export declare namespace WorkspaceImageSourceReference {
    function is(obj: object): obj is WorkspaceImageSourceReference;
}
export type PrebuiltWorkspaceState = "queued" | "building" | "aborted" | "timeout" | "available" | "failed";
export interface PrebuiltWorkspace {
    id: string;
    cloneURL: string;
    branch?: string;
    projectId?: string;
    commit: string;
    buildWorkspaceId: string;
    creationTime: string;
    state: PrebuiltWorkspaceState;
    statusVersion: number;
    error?: string;
    snapshot?: string;
}
export type PrebuiltWorkspaceWithWorkspace = PrebuiltWorkspace & {
    workspace: Workspace;
};
export declare namespace PrebuiltWorkspace {
    function isDone(pws: PrebuiltWorkspace): boolean;
    function isAvailable(pws: PrebuiltWorkspace): boolean;
    function buildDidSucceed(pws: PrebuiltWorkspace): boolean;
}
export interface PrebuiltWorkspaceUpdatable {
    id: string;
    prebuiltWorkspaceId: string;
    owner: string;
    repo: string;
    isResolved: boolean;
    installationId: string;
    /**
     * the commitSHA of the commit that triggered the prebuild
     */
    commitSHA?: string;
    issue?: string;
    contextUrl?: string;
}
export type PortOnOpen = "open-browser" | "open-preview" | "notify" | "ignore" | "ignore-completely";
export interface PortConfig {
    port: number;
    onOpen?: PortOnOpen;
    visibility?: PortVisibility;
    protocol?: PortProtocol;
    description?: string;
    name?: string;
}
export declare namespace PortConfig {
    function is(config: any): config is PortConfig;
}
export interface PortRangeConfig {
    port: string;
    onOpen?: PortOnOpen;
}
export declare namespace PortRangeConfig {
    function is(config: any): config is PortRangeConfig;
}
export interface TaskConfig {
    name?: string;
    before?: string;
    init?: string;
    prebuild?: string;
    command?: string;
    env?: {
        [env: string]: any;
    };
    openIn?: "bottom" | "main" | "left" | "right";
    openMode?: "split-top" | "split-left" | "split-right" | "split-bottom" | "tab-before" | "tab-after";
}
export declare namespace TaskConfig {
    function is(config: any): config is TaskConfig;
}
export declare namespace WorkspaceImageBuild {
    type Phase = "BaseImage" | "CodestackLayer" | "Error" | "Done";
    interface StateInfo {
        phase: Phase;
        currentStep?: number;
        maxSteps?: number;
    }
    interface LogContent {
        data: number[];
    }
    type LogCallback = (info: StateInfo, content: LogContent | undefined) => void;
    namespace LogLine {
        const DELIMITER = "\r\n";
        const DELIMITER_REGEX: RegExp;
    }
}
export type ImageConfig = ImageConfigString | ImageConfigFile;
export type ImageConfigString = string;
export declare namespace ImageConfigString {
    function is(config: ImageConfig | undefined): config is ImageConfigString;
}
export interface ImageConfigFile {
    file: string;
    context?: string;
}
export declare namespace ImageConfigFile {
    function is(config: ImageConfig | undefined): config is ImageConfigFile;
}
export interface ExternalImageConfigFile extends ImageConfigFile {
    externalSource: Commit;
}
export declare namespace ExternalImageConfigFile {
    function is(config: any | undefined): config is ExternalImageConfigFile;
}
export interface WorkspaceContext {
    title: string;
    ref?: string;
    /** This contains the URL portion of the contextURL (which might contain other modifiers as well). It's optional because it's not set for older workspaces. */
    normalizedContextURL?: string;
    forceCreateNewWorkspace?: boolean;
    forceImageBuild?: boolean;
    warnings?: string[];
}
export declare namespace WorkspaceContext {
    function is(context: any): context is WorkspaceContext;
}
export interface WithSnapshot {
    snapshotBucketId: string;
}
export declare namespace WithSnapshot {
    function is(context: any): context is WithSnapshot;
}
export interface WithPrebuild extends WithSnapshot {
    prebuildWorkspaceId: string;
    wasPrebuilt: true;
}
export declare namespace WithPrebuild {
    function is(context: any): context is WithPrebuild;
}
/**
 * WithDefaultConfig contexts disable the download of the codestack.yml from the repository
 * and fall back to the built-in configuration.
 */
export interface WithDefaultConfig {
    withDefaultConfig: true;
}
export declare namespace WithDefaultConfig {
    function is(context: any): context is WithDefaultConfig;
    function mark(ctx: WorkspaceContext): WorkspaceContext & WithDefaultConfig;
}
export interface SnapshotContext extends WorkspaceContext, WithSnapshot {
    snapshotId: string;
}
export declare namespace SnapshotContext {
    function is(context: any): context is SnapshotContext;
}
export interface WithCommitHistory {
    commitHistory?: string[];
    additionalRepositoryCommitHistories?: {
        cloneUrl: string;
        commitHistory: string[];
    }[];
}
export interface StartPrebuildContext extends WorkspaceContext, WithCommitHistory {
    actual: WorkspaceContext;
    project: Project;
    branch?: string;
}
export declare namespace StartPrebuildContext {
    function is(context: any): context is StartPrebuildContext;
}
export interface PrebuiltWorkspaceContext extends WorkspaceContext {
    originalContext: WorkspaceContext;
    prebuiltWorkspace: PrebuiltWorkspace;
    snapshotBucketId?: string;
}
export declare namespace PrebuiltWorkspaceContext {
    function is(context: any): context is PrebuiltWorkspaceContext;
}
export interface WithReferrerContext extends WorkspaceContext {
    referrer: string;
    referrerIde?: string;
}
export declare namespace WithReferrerContext {
    function is(context: any): context is WithReferrerContext;
}
export interface WithEnvvarsContext extends WorkspaceContext {
    envvars: EnvVarWithValue[];
}
export declare namespace WithEnvvarsContext {
    function is(context: any): context is WithEnvvarsContext;
}
export type RefType = "branch" | "tag" | "revision";
export declare namespace RefType {
    const getRefType: (commit: Commit) => RefType;
}
export interface Commit {
    repository: Repository;
    revision: string;
    ref?: string;
    refType?: RefType;
}
export interface AdditionalContentContext extends WorkspaceContext {
    /**
     * utf-8 encoded contents that will be copied on top of the workspace's filesystem
     */
    additionalFiles: {
        [filePath: string]: string;
    };
}
export declare namespace AdditionalContentContext {
    function is(ctx: any): ctx is AdditionalContentContext;
    function hasDockerConfig(ctx: any, config: WorkspaceConfig): boolean;
}
export interface OpenPrebuildContext extends WorkspaceContext {
    openPrebuildID: string;
}
export declare namespace OpenPrebuildContext {
    function is(ctx: any): ctx is OpenPrebuildContext;
}
export interface CommitContext extends WorkspaceContext, GitCheckoutInfo {
    /** @deprecated Moved to .repository.cloneUrl, left here for backwards-compatibility for old workspace contextes in the DB */
    cloneUrl?: string;
    /**
     * The clone and checkout information for additional repositories in case of multi-repo projects.
     */
    additionalRepositoryCheckoutInfo?: GitCheckoutInfo[];
}
export declare namespace CommitContext {
    /**
     * Creates a hash for all the commits of the CommitContext and all sub-repo commit infos.
     * The hash is max 255 chars long.
     * @param commitContext
     * @returns hash for commitcontext
     */
    function computeHash(commitContext: CommitContext): string;
    function isDefaultBranch(commitContext: CommitContext): boolean;
}
export interface GitCheckoutInfo extends Commit {
    checkoutLocation?: string;
    upstreamRemoteURI?: string;
    localBranch?: string;
}
export declare namespace CommitContext {
    function is(commit: any): commit is CommitContext;
}
export interface PullRequestContext extends CommitContext {
    nr: number;
    ref: string;
    base: {
        repository: Repository;
        ref: string;
    };
}
export declare namespace PullRequestContext {
    function is(ctx: any): ctx is PullRequestContext;
}
export interface IssueContext extends CommitContext {
    nr: number;
    ref: string;
    localBranch: string;
}
export declare namespace IssueContext {
    function is(ctx: any): ctx is IssueContext;
}
export interface NavigatorContext extends CommitContext {
    path: string;
    isFile: boolean;
}
export declare namespace NavigatorContext {
    function is(ctx: any): ctx is NavigatorContext;
}
export interface Repository {
    host: string;
    owner: string;
    name: string;
    cloneUrl: string;
    repoKind?: string;
    description?: string;
    avatarUrl?: string;
    webUrl?: string;
    defaultBranch?: string;
    /** Optional for backwards compatibility */
    private?: boolean;
    fork?: {
        parent: Repository;
    };
    /**
     * Optional date when the repository was last pushed to.
     */
    pushedAt?: string;
    /**
     * Optional display name (e.g. for Bitbucket)
     */
    displayName?: string;
}
export interface RepositoryInfo {
    url: string;
    name: string;
}
export interface Branch {
    name: string;
    commit: CommitInfo;
    htmlUrl: string;
}
export interface CommitInfo {
    author: string;
    sha: string;
    commitMessage: string;
    authorAvatarUrl?: string;
    authorDate?: string;
}
export interface WorkspaceInstancePortsChangedEvent {
    type: "PortsChanged";
    instanceID: string;
    portsOpened: number[];
    portsClosed: number[];
}
export declare namespace WorkspaceInstancePortsChangedEvent {
    function is(data: any): data is WorkspaceInstancePortsChangedEvent;
}
export interface WorkspaceSession {
    workspace: Workspace;
    instance: WorkspaceInstance;
    metrics?: WorkspaceInstanceMetrics;
}
export interface WorkspaceInfo {
    workspace: Workspace;
    latestInstance?: WorkspaceInstance;
}
export declare namespace WorkspaceInfo {
    function lastActiveISODate(info: WorkspaceInfo): string;
}
export type RunningWorkspaceInfo = WorkspaceInfo & {
    latestInstance: WorkspaceInstance;
};
export interface WorkspaceCreationResult {
    createdWorkspaceId?: string;
    workspaceURL?: string;
    existingWorkspaces?: WorkspaceInfo[];
}
export declare namespace WorkspaceCreationResult {
    function is(data: any): data is WorkspaceCreationResult;
}
export interface AuthProviderInfo {
    readonly authProviderId: string;
    readonly authProviderType: string;
    readonly host: string;
    readonly ownerId?: string;
    readonly organizationId?: string;
    readonly verified: boolean;
    readonly hiddenOnDashboard?: boolean;
    readonly disallowLogin?: boolean;
    readonly icon?: string;
    readonly description?: string;
    readonly settingsUrl?: string;
    readonly scopes?: string[];
    readonly requirements?: {
        readonly default: string[];
        readonly publicRepo: string[];
        readonly privateRepo: string[];
    };
}
export interface AuthProviderEntry {
    readonly id: string;
    readonly type: AuthProviderEntry.Type;
    readonly host: string;
    readonly ownerId: string;
    readonly organizationId?: string;
    readonly status: AuthProviderEntry.Status;
    readonly oauth: OAuth2Config;
    /** A random string that is to change whenever oauth changes (enforced on DB level) */
    readonly oauthRevision?: string;
}
export interface OAuth2Config {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly callBackUrl: string;
    readonly authorizationUrl: string;
    readonly tokenUrl: string;
    readonly scope?: string;
    readonly scopeSeparator?: string;
    readonly settingsUrl?: string;
    readonly authorizationParams?: {
        [key: string]: string;
    };
}
export declare namespace AuthProviderEntry {
    type Type = "GitHub" | "GitLab" | "Bitbucket" | "BitbucketServer" | "AzureDevOps" | string;
    type Status = "pending" | "verified";
    /**
     * Some auth providers require additional configuration like Azure DevOps.
     */
    interface OAuth2CustomConfig {
        /**
         * The URL to the authorize endpoint of the provider.
         */
        authorizationUrl?: string;
        /**
         * The URL to the oauth token endpoint of the provider.
         */
        tokenUrl?: string;
    }
    type NewEntry = Pick<AuthProviderEntry, "ownerId" | "host" | "type"> & {
        clientId?: string;
        clientSecret?: string;
    } & OAuth2CustomConfig;
    type UpdateEntry = Pick<AuthProviderEntry, "id" | "ownerId"> & {
        clientId?: string;
        clientSecret?: string;
    } & OAuth2CustomConfig;
    type NewOrgEntry = NewEntry & {
        organizationId: string;
    };
    type UpdateOrgEntry = Pick<AuthProviderEntry, "id"> & {
        clientId?: string;
        clientSecret?: string;
        organizationId: string;
    } & OAuth2CustomConfig;
    type UpdateOAuth2Config = Pick<OAuth2Config, "clientId" | "clientSecret"> & OAuth2CustomConfig;
    function redact(entry: AuthProviderEntry): AuthProviderEntry;
}
export interface Configuration {
    readonly isDedicatedInstallation: boolean;
}
export interface StripeConfig {
    individualUsagePriceIds: {
        [currency: string]: string;
    };
    teamUsagePriceIds: {
        [currency: string]: string;
    };
}
export interface LinkedInProfile {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    emailAddress: string;
}
export type SuggestedRepository = {
    url: string;
    projectId?: string;
    projectName?: string;
    repositoryName?: string;
};
//# sourceMappingURL=protocol.d.ts.map