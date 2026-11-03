/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { User, WorkspaceInfo, WorkspaceCreationResult, WorkspaceInstanceUser, WorkspaceImageBuild, AuthProviderInfo, Token, UserEnvVarValue, Configuration, UserInfo, CodestackTokenType, CodestackToken, AuthProviderEntry, GuessGitTokenScopesParams, GuessedGitTokenScopes, ProjectEnvVar, PrebuiltWorkspace, UserSSHPublicKeyValue, SSHPublicKeyValue, IDESettings, EnvVarWithValue, WorkspaceTimeoutSetting, WorkspaceContext, LinkedInProfile, SuggestedRepository } from "./protocol";
import { Team, TeamMemberInfo, TeamMembershipInvite, Project, TeamMemberRole, PrebuildWithStatus, StartPrebuildResult, PartialProject, OrganizationSettings } from "./teams-projects-protocol";
import { JsonRpcProxy, JsonRpcServer } from "./messaging/proxy-factory";
import { Disposable, CancellationToken } from "vscode-jsonrpc";
import { HeadlessLogUrls } from "./headless-workspace-log";
import { WorkspaceInstance, WorkspaceInstancePort, WorkspaceInstanceRepoStatus } from "./workspace-instance";
import { AdminServer } from "./admin-protocol";
import { RemotePageMessage, RemoteTrackMessage, RemoteIdentifyMessage } from "./analytics";
import { IDEServer } from "./ide-protocol";
import { ListUsageRequest, ListUsageResponse, CostCenterJSON } from "./usage";
import { SupportedWorkspaceClass } from "./workspace-class";
import { BillingMode } from "./billing-mode";
import { WorkspaceRegion } from "./workspace-cluster";
export interface CodestackClient {
    onInstanceUpdate(instance: WorkspaceInstance): void;
    onWorkspaceImageBuildLogs: WorkspaceImageBuild.LogCallback;
    onPrebuildUpdate(update: PrebuildWithStatus): void;
    notifyDidOpenConnection(): void;
    notifyDidCloseConnection(): void;
}
export declare const CodestackServer: unique symbol;
export interface CodestackServer extends JsonRpcServer<CodestackClient>, AdminServer, IDEServer {
    getLoggedInUser(): Promise<User>;
    updateLoggedInUser(user: Partial<User>): Promise<User>;
    sendPhoneNumberVerificationToken(phoneNumber: string): Promise<{
        verificationId: string;
    }>;
    verifyPhoneNumberVerificationToken(phoneNumber: string, token: string, verificationId: string): Promise<boolean>;
    getConfiguration(): Promise<Configuration>;
    getToken(query: CodestackServer.GetTokenSearchOptions): Promise<Token | undefined>;
    getCodestackTokenScopes(tokenHash: string): Promise<string[]>;
    deleteAccount(): Promise<void>;
    getClientRegion(): Promise<string | undefined>;
    getAuthProviders(): Promise<AuthProviderInfo[]>;
    getOwnAuthProviders(): Promise<AuthProviderEntry[]>;
    updateOwnAuthProvider(params: CodestackServer.UpdateOwnAuthProviderParams): Promise<AuthProviderEntry>;
    deleteOwnAuthProvider(params: CodestackServer.DeleteOwnAuthProviderParams): Promise<void>;
    createOrgAuthProvider(params: CodestackServer.CreateOrgAuthProviderParams): Promise<AuthProviderEntry>;
    updateOrgAuthProvider(params: CodestackServer.UpdateOrgAuthProviderParams): Promise<AuthProviderEntry>;
    getOrgAuthProviders(params: CodestackServer.GetOrgAuthProviderParams): Promise<AuthProviderEntry[]>;
    deleteOrgAuthProvider(params: CodestackServer.DeleteOrgAuthProviderParams): Promise<void>;
    /** @deprecated used for public-api compatibility only */
    getAuthProvider(id: string): Promise<AuthProviderEntry>;
    /** @deprecated used for public-api compatibility only */
    deleteAuthProvider(id: string): Promise<void>;
    /** @deprecated used for public-api compatibility only */
    updateAuthProvider(id: string, update: AuthProviderEntry.UpdateOAuth2Config): Promise<AuthProviderEntry>;
    getWorkspaces(options: CodestackServer.GetWorkspacesOptions): Promise<WorkspaceInfo[]>;
    getWorkspaceOwner(workspaceId: string): Promise<UserInfo | undefined>;
    getWorkspaceUsers(workspaceId: string): Promise<WorkspaceInstanceUser[]>;
    getSuggestedRepositories(organizationId: string): Promise<SuggestedRepository[]>;
    searchRepositories(params: SearchRepositoriesParams): Promise<SuggestedRepository[]>;
    /**
     * **Security:**
     * Sensitive information like an owner token is erased, since it allows access for all team members.
     * If you need to access an owner token use `getOwnerToken` instead.
     */
    getWorkspace(id: string): Promise<WorkspaceInfo>;
    isWorkspaceOwner(workspaceId: string): Promise<boolean>;
    getOwnerToken(workspaceId: string): Promise<string>;
    getIDECredentials(workspaceId: string): Promise<string>;
    /**
     * Creates and starts a workspace for the given context URL.
     * @param options CodestackServer.CreateWorkspaceOptions
     * @return WorkspaceCreationResult
     */
    createWorkspace(options: CodestackServer.CreateWorkspaceOptions): Promise<WorkspaceCreationResult>;
    startWorkspace(id: string, options: CodestackServer.StartWorkspaceOptions): Promise<StartWorkspaceResult>;
    stopWorkspace(id: string): Promise<void>;
    deleteWorkspace(id: string): Promise<void>;
    setWorkspaceDescription(id: string, desc: string): Promise<void>;
    controlAdmission(id: string, level: CodestackServer.AdmissionLevel): Promise<void>;
    resolveContext(contextUrl: string): Promise<WorkspaceContext>;
    updateWorkspaceUserPin(id: string, action: CodestackServer.PinAction): Promise<void>;
    sendHeartBeat(options: CodestackServer.SendHeartBeatOptions): Promise<void>;
    watchWorkspaceImageBuildLogs(workspaceId: string): Promise<void>;
    isPrebuildDone(pwsid: string): Promise<boolean>;
    getHeadlessLog(instanceId: string): Promise<HeadlessLogUrls>;
    setWorkspaceTimeout(workspaceId: string, duration: WorkspaceTimeoutDuration): Promise<SetWorkspaceTimeoutResult>;
    getWorkspaceTimeout(workspaceId: string): Promise<GetWorkspaceTimeoutResult>;
    getOpenPorts(workspaceId: string): Promise<WorkspaceInstancePort[]>;
    openPort(workspaceId: string, port: WorkspaceInstancePort): Promise<WorkspaceInstancePort | undefined>;
    closePort(workspaceId: string, port: number): Promise<void>;
    updateGitStatus(workspaceId: string, status: Required<WorkspaceInstanceRepoStatus> | undefined): Promise<void>;
    getWorkspaceEnvVars(workspaceId: string): Promise<EnvVarWithValue[]>;
    getAllEnvVars(): Promise<UserEnvVarValue[]>;
    setEnvVar(variable: UserEnvVarValue): Promise<void>;
    deleteEnvVar(variable: UserEnvVarValue): Promise<void>;
    hasSSHPublicKey(): Promise<boolean>;
    getSSHPublicKeys(): Promise<UserSSHPublicKeyValue[]>;
    addSSHPublicKey(value: SSHPublicKeyValue): Promise<UserSSHPublicKeyValue>;
    deleteSSHPublicKey(id: string): Promise<void>;
    getTeam(teamId: string): Promise<Team>;
    updateTeam(teamId: string, team: Partial<Pick<Team, "name" | "maintenanceMode" | "maintenanceNotification">>): Promise<Team>;
    getTeams(): Promise<Team[]>;
    getTeamMembers(teamId: string): Promise<TeamMemberInfo[]>;
    createTeam(name: string): Promise<Team>;
    joinTeam(inviteId: string): Promise<Team>;
    setTeamMemberRole(teamId: string, userId: string, role: TeamMemberRole): Promise<void>;
    removeTeamMember(teamId: string, userId: string): Promise<void>;
    getGenericInvite(teamId: string): Promise<TeamMembershipInvite>;
    resetGenericInvite(inviteId: string): Promise<TeamMembershipInvite>;
    deleteTeam(teamId: string): Promise<void>;
    getOrgSettings(orgId: string): Promise<OrganizationSettings>;
    updateOrgSettings(teamId: string, settings: Partial<OrganizationSettings>): Promise<OrganizationSettings>;
    getOrgWorkspaceClasses(orgId: string): Promise<SupportedWorkspaceClass[]>;
    getDefaultWorkspaceImage(params: GetDefaultWorkspaceImageParams): Promise<GetDefaultWorkspaceImageResult>;
    getOnboardingState(): Promise<CodestackServer.OnboardingState>;
    /** @deprecated no-op */
    getProviderRepositoriesForUser(params: GetProviderRepositoriesParams, cancellationToken?: CancellationToken): Promise<ProviderRepository[]>;
    createProject(params: CreateProjectParams): Promise<Project>;
    deleteProject(projectId: string): Promise<void>;
    getTeamProjects(teamId: string): Promise<Project[]>;
    getProjectOverview(projectId: string): Promise<Project.Overview | undefined>;
    findPrebuilds(params: FindPrebuildsParams): Promise<PrebuildWithStatus[]>;
    findPrebuildByWorkspaceID(workspaceId: string): Promise<PrebuiltWorkspace | undefined>;
    getPrebuild(prebuildId: string): Promise<PrebuildWithStatus | undefined>;
    triggerPrebuild(projectId: string, branchName: string | null): Promise<StartPrebuildResult>;
    cancelPrebuild(projectId: string, prebuildId: string): Promise<void>;
    updateProjectPartial(partialProject: PartialProject): Promise<void>;
    setProjectEnvironmentVariable(projectId: string, name: string, value: string, censored: boolean, id?: string): Promise<void>;
    getProjectEnvironmentVariables(projectId: string): Promise<ProjectEnvVar[]>;
    deleteProjectEnvironmentVariable(variableId: string): Promise<void>;
    getCodestackTokens(): Promise<CodestackToken[]>;
    generateNewCodestackToken(options: CodestackServer.GenerateNewCodestackTokenOptions): Promise<string>;
    deleteCodestackToken(tokenHash: string): Promise<void>;
    /** @deprecated always returns false */
    isGitHubAppEnabled(): Promise<boolean>;
    /** @deprecated this is a no-op */
    registerGithubApp(installationId: string): Promise<void>;
    /**
     * Stores a new snapshot for the given workspace and bucketId. Returns _before_ the actual snapshot is done. To wait for that, use `waitForSnapshot`.
     * @return the snapshot id
     */
    takeSnapshot(options: CodestackServer.TakeSnapshotOptions): Promise<string>;
    /**
     *
     * @param snapshotId
     */
    waitForSnapshot(snapshotId: string): Promise<void>;
    /**
     * Returns the list of snapshots that exist for a workspace.
     */
    getSnapshots(workspaceID: string): Promise<string[]>;
    guessGitTokenScopes(params: GuessGitTokenScopesParams): Promise<GuessedGitTokenScopes>;
    /**
     * Stripe/Usage
     */
    getStripePublishableKey(): Promise<string>;
    findStripeSubscriptionId(attributionId: string): Promise<string | undefined>;
    getPriceInformation(attributionId: string): Promise<string | undefined>;
    createStripeCustomerIfNeeded(attributionId: string, currency: string): Promise<void>;
    createHoldPaymentIntent(attributionId: string): Promise<{
        paymentIntentId: string;
        paymentIntentClientSecret: string;
    }>;
    subscribeToStripe(attributionId: string, paymentIntentId: string, usageLimit: number): Promise<number | undefined>;
    getStripePortalUrl(attributionId: string): Promise<string>;
    getCostCenter(attributionId: string): Promise<CostCenterJSON | undefined>;
    setUsageLimit(attributionId: string, usageLimit: number): Promise<void>;
    getUsageBalance(attributionId: string): Promise<number>;
    isCustomerBillingAddressInvalid(attributionId: string): Promise<boolean>;
    listUsage(req: ListUsageRequest): Promise<ListUsageResponse>;
    getBillingModeForTeam(teamId: string): Promise<BillingMode>;
    getLinkedInClientId(): Promise<string>;
    connectWithLinkedIn(code: string): Promise<LinkedInProfile>;
    /**
     * Analytics
     */
    trackEvent(event: RemoteTrackMessage): Promise<void>;
    trackLocation(event: RemotePageMessage): Promise<void>;
    identifyUser(event: RemoteIdentifyMessage): Promise<void>;
    /**
     * Frontend metrics
     */
    reportErrorBoundary(url: string, message: string): Promise<void>;
    getSupportedWorkspaceClasses(): Promise<SupportedWorkspaceClass[]>;
    updateWorkspaceTimeoutSetting(setting: Partial<WorkspaceTimeoutSetting>): Promise<void>;
    /**
     * getIDToken - doesn't actually do anything, just used to authenticat/authorise
     */
    getIDToken(): Promise<void>;
}
export interface RateLimiterError {
    method?: string;
    /**
     * Retry after this many seconds, earliest.
     * cmp.: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
     */
    retryAfter: number;
}
export interface GetDefaultWorkspaceImageParams {
    workspaceId?: string;
}
export type DefaultImageSource = "installation" | "organization";
export interface GetDefaultWorkspaceImageResult {
    image: string;
    source: DefaultImageSource;
}
export interface CreateProjectParams {
    name: string;
    cloneUrl: string;
    teamId: string;
    appInstallationId: string;
}
export interface FindPrebuildsParams {
    projectId: string;
    branch?: string;
    latest?: boolean;
    prebuildId?: string;
    limit?: number;
}
export interface GetProviderRepositoriesParams {
    provider: string;
    hints?: {
        installationId: string;
    } | object;
    searchString?: string;
    limit?: number;
    maxPages?: number;
}
export interface SearchRepositoriesParams {
    /** @deprecated unused */
    organizationId?: string;
    searchString: string;
    limit?: number;
}
export interface ProviderRepository {
    name: string;
    path?: string;
    account: string;
    accountAvatarUrl: string;
    cloneUrl: string;
    updatedAt?: string;
    installationId?: number;
    installationUpdatedAt?: string;
}
export type WorkspaceTimeoutDuration = string;
export declare namespace WorkspaceTimeoutDuration {
    function validate(duration: string): WorkspaceTimeoutDuration;
}
export declare const WORKSPACE_TIMEOUT_DEFAULT_SHORT: WorkspaceTimeoutDuration;
export declare const WORKSPACE_TIMEOUT_DEFAULT_LONG: WorkspaceTimeoutDuration;
export declare const WORKSPACE_TIMEOUT_EXTENDED: WorkspaceTimeoutDuration;
export declare const WORKSPACE_LIFETIME_SHORT: WorkspaceTimeoutDuration;
export declare const WORKSPACE_LIFETIME_LONG: WorkspaceTimeoutDuration;
export declare const MAX_PARALLEL_WORKSPACES_FREE = 4;
export declare const MAX_PARALLEL_WORKSPACES_PAID = 16;
export declare const createServiceMock: <C extends CodestackClient, S extends CodestackServer>(methods: Partial<JsonRpcProxy<S>>) => CodestackServiceImpl<C, S>;
export declare const createServerMock: <S extends CodestackServer>(methods: Partial<JsonRpcProxy<S>>) => JsonRpcProxy<S>;
export interface SetWorkspaceTimeoutResult {
    resetTimeoutOnWorkspaces: string[];
    humanReadableDuration: string;
}
export interface GetWorkspaceTimeoutResult {
    duration: WorkspaceTimeoutDuration;
    canChange: boolean;
    humanReadableDuration: string;
}
export interface StartWorkspaceResult {
    instanceID: string;
    workspaceURL?: string;
}
export declare namespace CodestackServer {
    interface GetWorkspacesOptions {
        limit?: number;
        searchString?: string;
        pinnedOnly?: boolean;
        projectId?: string | string[];
        includeWithoutProject?: boolean;
        organizationId?: string;
    }
    interface GetAccountStatementOptions {
        date?: string;
    }
    interface CreateWorkspaceOptions extends StartWorkspaceOptions {
        contextUrl: string;
        organizationId: string;
        projectId?: string;
        ignoreRunningWorkspaceOnSameCommit?: boolean;
        forceDefaultConfig?: boolean;
    }
    interface StartWorkspaceOptions {
        forceDefaultImage?: boolean;
        workspaceClass?: string;
        ideSettings?: IDESettings;
        region?: WorkspaceRegion;
    }
    interface TakeSnapshotOptions {
        workspaceId: string;
        dontWait?: boolean;
    }
    interface GetTokenSearchOptions {
        readonly host: string;
    }
    interface SendHeartBeatOptions {
        readonly instanceId: string;
        readonly wasClosed?: boolean;
        readonly roundTripTime?: number;
    }
    interface UpdateOwnAuthProviderParams {
        readonly entry: AuthProviderEntry.UpdateEntry | AuthProviderEntry.NewEntry;
    }
    interface DeleteOwnAuthProviderParams {
        readonly id: string;
    }
    interface CreateOrgAuthProviderParams {
        readonly entry: Omit<AuthProviderEntry.NewOrgEntry, "ownerId">;
    }
    interface UpdateOrgAuthProviderParams {
        readonly entry: AuthProviderEntry.UpdateOrgEntry;
    }
    interface GetOrgAuthProviderParams {
        readonly organizationId: string;
    }
    interface DeleteOrgAuthProviderParams {
        readonly id: string;
        readonly organizationId: string;
    }
    type AdmissionLevel = "owner" | "everyone";
    type PinAction = "pin" | "unpin" | "toggle";
    interface GenerateNewCodestackTokenOptions {
        name?: string;
        type: CodestackTokenType;
        scopes?: string[];
    }
    interface OnboardingState {
        /**
         * Whether this Codestack instance is already configured with SSO.
         */
        readonly isCompleted: boolean;
        /**
         * Total number of organizations.
         */
        readonly organizationCountTotal: number;
    }
}
export declare const CodestackServerPath = "/codestack";
export declare const CodestackServerProxy: unique symbol;
export type CodestackServerProxy<S extends CodestackServer> = JsonRpcProxy<S>;
export declare class CodestackCompositeClient<Client extends CodestackClient> implements CodestackClient {
    protected clients: Partial<Client>[];
    registerClient(client: Partial<Client>): Disposable;
    onInstanceUpdate(instance: WorkspaceInstance): void;
    onPrebuildUpdate(update: PrebuildWithStatus): void;
    onWorkspaceImageBuildLogs(info: WorkspaceImageBuild.StateInfo, content: WorkspaceImageBuild.LogContent | undefined): void;
    notifyDidOpenConnection(): void;
    notifyDidCloseConnection(): void;
}
export type CodestackService = CodestackServiceImpl<CodestackClient, CodestackServer>;
export declare class WorkspaceInstanceUpdateListener {
    private readonly service;
    private _info;
    private readonly onDidChangeEmitter;
    readonly onDidChange: import("./util/event").Event<void>;
    private source;
    get info(): WorkspaceInfo;
    constructor(service: CodestackService, _info: WorkspaceInfo);
    private syncQueue;
    private syncTokenSource;
    /**
     * Only one sync can be performed at the same time.
     * Any new sync request or instance update cancels all previously scheduled sync requests.
     */
    private sync;
    private cancelSync;
    /**
     * If sync seen more recent update then ignore all updates with previous phases.
     * Within the same phase still the race can occur but which should be eventually consistent.
     */
    private isOutOfOrder;
}
export interface CodestackServiceOptions {
    onReconnect?: () => void | Promise<void>;
}
export declare class CodestackServiceImpl<Client extends CodestackClient, Server extends CodestackServer> {
    readonly server: JsonRpcProxy<Server>;
    private options?;
    private readonly compositeClient;
    constructor(server: JsonRpcProxy<Server>, options?: CodestackServiceOptions | undefined);
    registerClient(client: Partial<Client>): Disposable;
    private readonly instanceListeners;
    listenToInstance(workspaceId: string): Promise<WorkspaceInstanceUpdateListener>;
    reconnect(): Promise<void>;
}
//# sourceMappingURL=codestack-service.d.ts.map