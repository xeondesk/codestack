/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export declare class ParseWorkspaceIdTest {
    parseWorkspaceIdFromHostname_fromWorkspaceLocation(): void;
    parseWorkspaceIdFromHostname_fromWorkspacePortLocation(): void;
    parseWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefix(): void;
    parseWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefixCustomHost(): void;
    parseLegacyWorkspaceIdFromHostname_fromWorkspaceLocation(): void;
    parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocation(): void;
    parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefix(): void;
    parseLegacyWorkspaceIdFromHostname_fromWorkspacePortLocationWithWebviewPrefixCustomHost(): void;
    matchesInstanceIdOrLegacyWorkspaceIdExactly_positive(): void;
    matchesInstanceIdOrLegacyWorkspaceIdExactly_negative(): void;
    matchesWorkspaceIdExactly_new_positive(): void;
    matchesWorkspaceIdExactly_new_negative(): void;
    isWorkspaceId_positive_new(): void;
    isWorkspaceId_positive_legacy(): void;
    isWorkspaceId_negative_empty(): void;
}
//# sourceMappingURL=parse-workspace-id.spec.d.ts.map