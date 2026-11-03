/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { DeepPartial } from "./util/deep-partial";
import { PermissionName } from "./permission";
declare const workspaceRegions: readonly ["europe", "north-america", "south-america", "africa", "asia", ""];
export type WorkspaceRegion = typeof workspaceRegions[number];
export declare function isWorkspaceRegion(s: string): s is WorkspaceRegion;
export interface WorkspaceCluster {
    name: string;
    region: WorkspaceRegion;
    url: string;
    tls?: TLSConfig;
    state: WorkspaceClusterState;
    maxScore: number;
    score: number;
    govern: boolean;
    admissionConstraints?: AdmissionConstraint[];
    availableWorkspaceClasses?: WorkspaceClass[];
    preferredWorkspaceClass?: string;
}
export declare namespace WorkspaceCluster {
    function preferredWorkspaceClass(cluster: WorkspaceCluster): WorkspaceClass | undefined;
}
export type WorkspaceClusterState = "available" | "cordoned" | "draining";
export interface TLSConfig {
    ca: string;
    key: string;
    crt: string;
}
export declare namespace TLSConfig {
    const loadFromBase64File: (path: string) => string;
}
export type WorkspaceClusterWoTLS = Omit<WorkspaceCluster, "tls">;
export type WorkspaceManagerConnectionInfo = Pick<WorkspaceCluster, "name" | "url" | "tls">;
export type AdmissionConstraint = AdmissionConstraintFeaturePreview | AdmissionConstraintHasPermission | AdmissionConstraintHasClass;
export type AdmissionConstraintFeaturePreview = {
    type: "has-feature-preview";
};
export type AdmissionConstraintHasPermission = {
    type: "has-permission";
    permission: PermissionName;
};
export type AdmissionConstraintHasClass = {
    type: "has-class";
    id: string;
    displayName: string;
};
export declare namespace AdmissionConstraint {
    function is(o: any): o is AdmissionConstraint;
    function isHasPermissionConstraint(o: any): o is AdmissionConstraintHasPermission;
    function hasPermission(ac: AdmissionConstraint, permission: PermissionName): boolean;
}
export interface WorkspaceClass {
    id: string;
    displayName: string;
    description: string;
    creditsPerMinute: number;
}
export declare const WorkspaceClusterDB: unique symbol;
export interface WorkspaceClusterDB {
    /**
     * Stores the given WorkspaceCluster to the cluster-local DB in a consistent manner.
     * If there already is an entry with the same name it's merged and updated with the given state.
     * @param cluster
     */
    save(cluster: WorkspaceCluster): Promise<void>;
    /**
     * Deletes the cluster identified by this name, if any.
     * @param name
     */
    deleteByName(name: string): Promise<void>;
    /**
     * Finds a WorkspaceCluster with the given name. If there is none, `undefined` is returned.
     * @param name
     */
    findByName(name: string): Promise<WorkspaceCluster | undefined>;
    /**
     * Lists all WorkspaceClusterWoTls for which the given predicate is true (does not return TLS for size/speed concerns)
     * @param predicate
     */
    findFiltered(predicate: WorkspaceClusterFilter): Promise<WorkspaceClusterWoTLS[]>;
}
export type WorkspaceClusterFilter = DeepPartial<Pick<WorkspaceCluster, "name" | "state" | "govern" | "url" | "region">> & Partial<{
    minScore: number;
}>;
export {};
//# sourceMappingURL=workspace-cluster.d.ts.map