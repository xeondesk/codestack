"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.Permission = exports.RolesOrPermissions = exports.RoleName = exports.Roles = exports.Permissions = void 0;
// see below for explanation
exports.Permissions = {
    developer: undefined,
    "registry-access": undefined,
    "admin-permissions": undefined,
    "admin-users": undefined,
    "admin-workspace-content": undefined,
    "admin-workspaces": undefined,
    "admin-projects": undefined,
    "new-workspace-cluster": undefined,
};
exports.Roles = { devops: undefined, viewer: undefined, admin: undefined };
var RoleName;
(function (RoleName) {
    RoleName.is = (o) => {
        return typeof o === "string" && Role.all().some((r) => r.name === o);
    };
})(RoleName || (exports.RoleName = RoleName = {}));
var RolesOrPermissions;
(function (RolesOrPermissions) {
    function toPermissionSet(rolesOrPermissions) {
        rolesOrPermissions = rolesOrPermissions || [];
        const permissions = new Set();
        for (const rop of rolesOrPermissions) {
            if (Permission.is(rop)) {
                permissions.add(rop);
            }
            else if (RoleName.is(rop)) {
                Role.getByName(rop).permissions.forEach((p) => permissions.add(p));
            }
        }
        return permissions;
    }
    RolesOrPermissions.toPermissionSet = toPermissionSet;
})(RolesOrPermissions || (exports.RolesOrPermissions = RolesOrPermissions = {}));
var Permission;
(function (Permission) {
    /** The permission to develop on this running Codestack installation */
    Permission.DEVELOPER = "developer";
    /** The permission for registry access (start workspaces referencing codestack-internal Docker images) */
    Permission.REGISTRY_ACCESS = "registry-access";
    /** The permission for administration and deletion of user data */
    Permission.ADMIN_PERMISSIONS = "admin-permissions";
    /** The permission for accessing user data */
    Permission.ADMIN_USERS = "admin-users";
    /** The permission for accessing workspace content */
    Permission.ADMIN_WORKSPACE_CONTENT = "admin-workspace-content";
    /** The permission for accessing workspace data */
    Permission.ADMIN_WORKSPACES = "admin-workspaces";
    /** The permission for accessing all projects data */
    Permission.ADMIN_PROJECTS = "admin-projects";
    Permission.is = (o) => {
        return typeof o === "string" && Permission.all().some((p) => p === o);
    };
    Permission.all = () => {
        return Object.keys(exports.Permissions);
    };
})(Permission || (exports.Permission = Permission = {}));
var Role;
(function (Role) {
    /** A role for people that are allowed to view Codestack internals */
    Role.VIEWER = {
        name: "viewer",
        permissions: [Permission.REGISTRY_ACCESS],
    };
    Role.ADMIN = {
        name: "admin",
        permissions: [Permission.ADMIN_USERS, Permission.ADMIN_WORKSPACES, Permission.ADMIN_PROJECTS],
    };
    Role.getByName = (name) => {
        const result = Role.all().find((r) => r.name === name);
        if (!result) {
            throw Error("Unknown RoleName: " + name);
        }
        return result;
    };
    Role.all = () => {
        return Object.keys(Role)
            .map((k) => Role[k])
            .filter((k) => typeof k === "object");
    };
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=permission.js.map