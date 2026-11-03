"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberRole = exports.VALID_ORG_MEMBER_ROLES = exports.PrebuildInfo = exports.Project = void 0;
const uuid_1 = require("uuid");
var Project;
(function (Project) {
    function is(data) {
        return typeof data === "object" && ["id", "name", "cloneUrl", "teamId"].every((p) => p in data);
    }
    Project.is = is;
    Project.create = (project) => {
        return {
            ...project,
            id: (0, uuid_1.v4)(),
            creationTime: new Date().toISOString(),
        };
    };
    Project.PREBUILD_SETTINGS_DEFAULTS = {
        enable: false,
        branchMatchingPattern: "**",
        prebuildInterval: 20,
        branchStrategy: "all-branches",
        triggerStrategy: "activity-based",
    };
    /**
     * Returns effective prebuild settings for the given project. The resulting settings
     * contain default values for properties which are not set explicitly for this project.
     */
    function getPrebuildSettings(project) {
        var _a, _b;
        // ignoring persisted properties with `undefined` values to exclude them from the override.
        const overrides = Object.fromEntries(Object.entries((_b = (_a = project.settings) === null || _a === void 0 ? void 0 : _a.prebuilds) !== null && _b !== void 0 ? _b : {}).filter(([_, value]) => value !== undefined));
        return {
            ...Project.PREBUILD_SETTINGS_DEFAULTS,
            ...overrides,
        };
    }
    Project.getPrebuildSettings = getPrebuildSettings;
    function hasPrebuildSettings(project) {
        var _a;
        return !(typeof ((_a = project.settings) === null || _a === void 0 ? void 0 : _a.prebuilds) === "undefined");
    }
    Project.hasPrebuildSettings = hasPrebuildSettings;
    let Overview;
    (function (Overview) {
        function is(data) {
            return Array.isArray(data === null || data === void 0 ? void 0 : data.branches);
        }
        Overview.is = is;
    })(Overview = Project.Overview || (Project.Overview = {}));
})(Project || (exports.Project = Project = {}));
var PrebuildInfo;
(function (PrebuildInfo) {
    function is(data) {
        return typeof data === "object" && ["id", "buildWorkspaceId", "projectId", "branch"].every((p) => p in data);
    }
    PrebuildInfo.is = is;
})(PrebuildInfo || (exports.PrebuildInfo = PrebuildInfo = {}));
exports.VALID_ORG_MEMBER_ROLES = ["owner", "member", "collaborator"];
var TeamMemberRole;
(function (TeamMemberRole) {
    function isValid(role) {
        return exports.VALID_ORG_MEMBER_ROLES.includes(role);
    }
    TeamMemberRole.isValid = isValid;
})(TeamMemberRole || (exports.TeamMemberRole = TeamMemberRole = {}));
//# sourceMappingURL=teams-projects-protocol.js.map