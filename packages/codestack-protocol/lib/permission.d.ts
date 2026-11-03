/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export declare const Permissions: {
    developer: undefined;
    "registry-access": undefined;
    "admin-permissions": undefined;
    "admin-users": undefined;
    "admin-workspace-content": undefined;
    "admin-workspaces": undefined;
    "admin-projects": undefined;
    "new-workspace-cluster": undefined;
};
export type PermissionName = keyof typeof Permissions;
export declare const Roles: {
    devops: undefined;
    viewer: undefined;
    admin: undefined;
};
export type RoleName = keyof typeof Roles;
export type RoleOrPermission = RoleName | PermissionName;
export declare namespace RoleName {
    const is: (o: any) => o is RoleName;
}
export interface Role {
    name: RoleName;
    permissions: PermissionName[];
}
export declare namespace RolesOrPermissions {
    function toPermissionSet(rolesOrPermissions: RoleOrPermission[] | undefined): Set<PermissionName>;
}
export declare namespace Permission {
    /** The permission to develop on this running Codestack installation */
    const DEVELOPER: PermissionName;
    /** The permission for registry access (start workspaces referencing codestack-internal Docker images) */
    const REGISTRY_ACCESS: PermissionName;
    /** The permission for administration and deletion of user data */
    const ADMIN_PERMISSIONS: PermissionName;
    /** The permission for accessing user data */
    const ADMIN_USERS: PermissionName;
    /** The permission for accessing workspace content */
    const ADMIN_WORKSPACE_CONTENT: PermissionName;
    /** The permission for accessing workspace data */
    const ADMIN_WORKSPACES: PermissionName;
    /** The permission for accessing all projects data */
    const ADMIN_PROJECTS: PermissionName;
    const is: (o: any) => o is PermissionName;
    const all: () => PermissionName[];
}
export declare namespace Role {
    /** A role for people that are allowed to view Codestack internals */
    const VIEWER: Role;
    const ADMIN: Role;
    const getByName: (name: RoleName) => Role;
    const all: () => Role[];
}
//# sourceMappingURL=permission.d.ts.map