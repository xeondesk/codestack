/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export interface SnapshotUrl {
    bucketId: string;
    fullPath: string;
    filename: string;
}
export declare namespace SnapshotUrl {
    function parse(url: string): SnapshotUrl;
}
//# sourceMappingURL=snapshot-url.d.ts.map