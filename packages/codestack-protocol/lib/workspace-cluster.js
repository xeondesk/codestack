"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceClusterDB = exports.AdmissionConstraint = exports.TLSConfig = exports.WorkspaceCluster = void 0;
exports.isWorkspaceRegion = isWorkspaceRegion;
const fs = __importStar(require("fs"));
const env_1 = require("./env");
const workspaceRegions = ["europe", "north-america", "south-america", "africa", "asia", ""];
function isWorkspaceRegion(s) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return workspaceRegions.indexOf(s) !== -1;
}
var WorkspaceCluster;
(function (WorkspaceCluster) {
    function preferredWorkspaceClass(cluster) {
        return (cluster.availableWorkspaceClasses || []).find((c) => c.id === cluster.preferredWorkspaceClass);
    }
    WorkspaceCluster.preferredWorkspaceClass = preferredWorkspaceClass;
})(WorkspaceCluster || (exports.WorkspaceCluster = WorkspaceCluster = {}));
var TLSConfig;
(function (TLSConfig) {
    TLSConfig.loadFromBase64File = (path) => fs.readFileSync((0, env_1.filePathTelepresenceAware)(path)).toString("base64");
})(TLSConfig || (exports.TLSConfig = TLSConfig = {}));
var AdmissionConstraint;
(function (AdmissionConstraint) {
    function is(o) {
        return !!o && "type" in o;
    }
    AdmissionConstraint.is = is;
    function isHasPermissionConstraint(o) {
        return is(o) && o.type === "has-permission";
    }
    AdmissionConstraint.isHasPermissionConstraint = isHasPermissionConstraint;
    function hasPermission(ac, permission) {
        return isHasPermissionConstraint(ac) && ac.permission === permission;
    }
    AdmissionConstraint.hasPermission = hasPermission;
})(AdmissionConstraint || (exports.AdmissionConstraint = AdmissionConstraint = {}));
exports.WorkspaceClusterDB = Symbol("WorkspaceClusterDB");
//# sourceMappingURL=workspace-cluster.js.map