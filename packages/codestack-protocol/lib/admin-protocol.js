"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceAndInstance = void 0;
var WorkspaceAndInstance;
(function (WorkspaceAndInstance) {
    function toWorkspace(wai) {
        return {
            id: wai.workspaceId,
            creationTime: wai.workspaceCreationTime,
            ...wai,
        };
    }
    WorkspaceAndInstance.toWorkspace = toWorkspace;
    function toInstance(wai) {
        if (!wai.instanceId) {
            return undefined;
        }
        return {
            id: wai.instanceId,
            creationTime: wai.instanceCreationTime,
            ...wai,
        };
    }
    WorkspaceAndInstance.toInstance = toInstance;
})(WorkspaceAndInstance || (exports.WorkspaceAndInstance = WorkspaceAndInstance = {}));
//# sourceMappingURL=admin-protocol.js.map