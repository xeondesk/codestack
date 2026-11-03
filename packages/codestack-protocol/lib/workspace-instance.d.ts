/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { EnvVar, NamedWorkspaceFeatureFlag, TaskConfig } from "./protocol";
import { WorkspaceRegion } from "./workspace-cluster";
export interface WorkspaceInstance {
    id: string;
    workspaceId: string;
    creationTime: string;
    deployedTime?: string;
    startedTime?: string;
    stoppingTime?: string;
    stoppedTime?: string;
    ideUrl: string;
    region: string;
    workspaceImage: string;
    status: WorkspaceInstanceStatus;
    gitStatus?: WorkspaceInstanceRepoStatus;
    configuration: WorkspaceInstanceConfiguration;
    readonly deleted?: boolean;
    /**
     * Contains information about the image build, if there was any
     */
    imageBuildInfo?: ImageBuildInfo;
    /**
     * workspace class, also known as workspace size, determines the type of
     * resources that are provided to the workspace.
     */
    workspaceClass?: string;
    /**
     * Identifies the team or user to which this instance's runtime should be attributed to
     * (e.g. for usage analytics or billing purposes).
     */
    usageAttributionId?: string;
}
export interface WorkspaceInstanceStatus {
    version?: number;
    phase: WorkspaceInstancePhase;
    conditions: WorkspaceInstanceConditions;
    message?: string;
    exposedPorts?: WorkspaceInstancePort[];
    timeout?: string;
    nodeName?: string;
    podName?: string;
    nodeIp?: string;
    ownerToken?: string;
    metrics?: WorkspaceInstanceMetrics;
}
export type WorkspaceInstancePhase = "unknown" | "preparing" | "building" | "pending" | "creating" | "initializing" | "running" | "interrupted" | "stopping" | "stopped";
export interface WorkspaceInstanceConditions {
    failed?: string;
    timeout?: string;
    pullingImages?: boolean;
    deployed?: boolean;
    neededImageBuild?: boolean;
    firstUserActivity?: string;
    headlessTaskFailed?: string;
    stoppedByRequest?: boolean;
}
export type AdmissionLevel = "owner_only" | "everyone";
export type PortVisibility = "public" | "private";
export type PortProtocol = "http" | "https";
export interface WorkspaceInstancePort {
    port: number;
    visibility?: PortVisibility;
    url?: string;
    protocol?: PortProtocol;
}
export interface WorkspaceInstanceRepoStatus {
    branch?: string;
    latestCommit?: string;
    uncommitedFiles?: string[];
    totalUncommitedFiles?: number;
    untrackedFiles?: string[];
    totalUntrackedFiles?: number;
    unpushedCommits?: string[];
    totalUnpushedCommits?: number;
}
export declare namespace WorkspaceInstanceRepoStatus {
    function equals(a: WorkspaceInstanceRepoStatus | undefined, b: WorkspaceInstanceRepoStatus | undefined): boolean;
}
export interface ConfigurationIdeConfig {
    useLatest?: boolean;
    ide?: string;
    preferToolbox?: boolean;
}
export interface IdeSetup {
    tasks?: TaskConfig[];
    envvars?: EnvVar[];
}
export interface WorkspaceInstanceConfiguration {
    theiaVersion?: string;
    featureFlags?: NamedWorkspaceFeatureFlag[];
    ideImage: string;
    ideImageLayers?: string[];
    supervisorImage?: string;
    ideSetup?: IdeSetup;
    ideConfig?: ConfigurationIdeConfig;
    regionPreference?: WorkspaceRegion;
    fromBackup?: boolean;
}
/**
 * Holds information about the image build (if there was one) for this WorkspaceInstance
 */
export interface ImageBuildInfo {
    log?: ImageBuildLogInfo;
}
/**
 * Holds information about how to access logs for this an image build
 */
export interface ImageBuildLogInfo {
    url: string;
    headers: {
        [key: string]: string;
    };
}
/**
 * Holds metrics about the workspace instance
 */
export interface WorkspaceInstanceMetrics {
    image?: ImageMetrics;
    /**
     * Metrics about the workspace initializer
     */
    initializerMetrics?: InitializerMetrics;
}
export interface ImageMetrics {
    /**
     * the total size of the image in bytes (includes Codestack-specific layers like IDE)
     */
    totalSize?: number;
    /**
     * the size of the workspace image in bytes
     */
    workspaceImageSize?: number;
}
export interface InitializerMetrics {
    git?: InitializerMetric;
    fileDownload?: InitializerMetric;
    snapshot?: InitializerMetric;
    backup?: InitializerMetric;
    prebuild?: InitializerMetric;
    composite?: InitializerMetric;
}
export interface InitializerMetric {
    /**
     * Duration in milliseconds
     */
    duration: number;
    /**
     * Size in bytes
     */
    size: number;
}
//# sourceMappingURL=workspace-instance.d.ts.map