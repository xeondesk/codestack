"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotUrl = void 0;
var SnapshotUrl;
(function (SnapshotUrl) {
    function parse(url) {
        const parts = url.split("@");
        if (parts.length !== 2) {
            throw new Error(`cannot parse snapshot URL: ${url}`);
        }
        const [fullPath, bucketId] = parts;
        const pathParts = fullPath.split("/");
        if (pathParts.length < 1) {
            throw new Error(`cannot parse snapshot URL: ${url}`);
        }
        const filename = pathParts[pathParts.length - 1];
        return { bucketId, fullPath, filename };
    }
    SnapshotUrl.parse = parse;
})(SnapshotUrl || (exports.SnapshotUrl = SnapshotUrl = {}));
//# sourceMappingURL=snapshot-url.js.map