/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
export interface UrlChange {
    (old: URL): Partial<URL>;
}
export type UrlUpdate = UrlChange | Partial<URL>;
export declare class CodestackHostUrl {
    readonly url: URL;
    constructor(url: string);
    withWorkspacePrefix(workspaceId: string, region: string): CodestackHostUrl;
    withDomainPrefix(prefix: string): CodestackHostUrl;
    withoutWorkspacePrefix(): CodestackHostUrl;
    withoutDomainPrefix(removeSegmentsCount: number): CodestackHostUrl;
    with(urlUpdate: UrlUpdate): CodestackHostUrl;
    withApi(urlUpdate?: UrlUpdate): CodestackHostUrl;
    withContext(contextUrl: string, startOptions?: {
        showOptions?: boolean;
        editor?: string;
        workspaceClass?: string;
    }): CodestackHostUrl;
    asWebsocket(): CodestackHostUrl;
    asWorkspacePage(): CodestackHostUrl;
    asDashboard(): CodestackHostUrl;
    asBilling(): CodestackHostUrl;
    asLogin(): CodestackHostUrl;
    asAccessControl(): CodestackHostUrl;
    asSettings(): CodestackHostUrl;
    asPreferences(): CodestackHostUrl;
    asStart(workspaceId?: string | undefined): CodestackHostUrl;
    asWorkspaceAuth(instanceID: string): CodestackHostUrl;
    toString(): string;
    toStringWoRootSlash(): string;
    get debugWorkspace(): boolean;
    get workspaceId(): string | undefined;
    get blobServe(): boolean;
    asSorry(message: string): CodestackHostUrl;
    asApiLogout(): CodestackHostUrl;
    asIDEProxy(): CodestackHostUrl;
    asPublicServices(): CodestackHostUrl;
    asIDEMetrics(): CodestackHostUrl;
    asLoginWithOTS(userId: string, key: string, returnToUrl?: string): CodestackHostUrl;
}
//# sourceMappingURL=codestack-host-url.d.ts.map