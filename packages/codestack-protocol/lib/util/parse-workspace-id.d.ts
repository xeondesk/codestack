/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
/**
 * Hostname may be of the form:
 *  - moccasin-ferret-155799b3.ws-eu01.codestack.io
 *  - 1234-moccasin-ferret-155799b3.ws-eu01.codestack.io
 *  - webview-1234-moccasin-ferret-155799b3.ws-eu01.codestack.io (or any other string replacing webview)
 * @param hostname The hostname the request is headed to
 */
export declare const parseWorkspaceIdFromHostname: (hostname: string) => string | undefined;
/**
 * @param maybeId
 * @returns
 */
export declare const matchesInstanceIdOrLegacyWorkspaceIdExactly: (maybeId: string) => boolean;
/**
 * @param maybeWorkspaceId
 * @returns
 */
export declare const matchesNewWorkspaceIdExactly: (maybeWorkspaceId: string) => boolean;
/**
 * Matches both new and legacy workspace ids
 */
export declare const isWorkspaceId: (maybeWorkspaceId?: string) => boolean;
//# sourceMappingURL=parse-workspace-id.d.ts.map