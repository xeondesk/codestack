"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceInstanceRepoStatus = void 0;
var WorkspaceInstanceRepoStatus;
(function (WorkspaceInstanceRepoStatus) {
    function equals(a, b) {
        if (!a && !b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return (a.branch === b.branch &&
            a.latestCommit === b.latestCommit &&
            a.totalUncommitedFiles === b.totalUncommitedFiles &&
            a.totalUnpushedCommits === b.totalUnpushedCommits &&
            a.totalUntrackedFiles === b.totalUntrackedFiles &&
            stringArrayEquals(a.uncommitedFiles, b.uncommitedFiles) &&
            stringArrayEquals(a.untrackedFiles, b.untrackedFiles) &&
            stringArrayEquals(a.unpushedCommits, b.unpushedCommits));
    }
    WorkspaceInstanceRepoStatus.equals = equals;
    function stringArrayEquals(a, b) {
        if (a === undefined && b === undefined)
            return true;
        if (a === undefined || b === undefined)
            return false;
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
})(WorkspaceInstanceRepoStatus || (exports.WorkspaceInstanceRepoStatus = WorkspaceInstanceRepoStatus = {}));
//# sourceMappingURL=workspace-instance.js.map