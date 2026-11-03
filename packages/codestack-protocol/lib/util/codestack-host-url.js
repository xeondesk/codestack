"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodestackHostUrl = void 0;
const URL = require("url").URL || window.URL;
const logging_1 = require("./logging");
const baseWorkspaceIDRegex = "(([a-f][0-9a-f]{7}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})|([0-9a-z]{2,16}-[0-9a-z]{2,16}-[0-9a-z]{8,11}))";
// this pattern matches v4 UUIDs as well as the new generated workspace ids (e.g. pink-panda-ns35kd21)
const workspaceIDRegex = RegExp(`^(?:debug-)?${baseWorkspaceIDRegex}$`);
// this pattern matches URL prefixes of workspaces
const workspaceUrlPrefixRegex = RegExp(`^(([0-9]{4,6}|debug)-)?${baseWorkspaceIDRegex}\\.`);
class CodestackHostUrl {
    constructor(url) {
        //HACK - we don't want clients to pass in a URL object, but we need to use it internally
        const urlParam = url;
        if (typeof urlParam === "string") {
            // public constructor
            this.url = new URL(url);
            this.url.search = "";
            this.url.hash = "";
            this.url.pathname = "";
        }
        else if (urlParam instanceof URL) {
            // internal constructor, see with
            this.url = urlParam;
        }
        else {
            logging_1.log.error("Unexpected urlParam", { urlParam });
        }
    }
    withWorkspacePrefix(workspaceId, region) {
        return this.withDomainPrefix(`${workspaceId}.ws-${region}.`);
    }
    withDomainPrefix(prefix) {
        return this.with((url) => ({ host: prefix + url.host }));
    }
    withoutWorkspacePrefix() {
        if (!this.url.host.match(workspaceUrlPrefixRegex)) {
            // URL has no workspace prefix
            return this;
        }
        return this.withoutDomainPrefix(2);
    }
    withoutDomainPrefix(removeSegmentsCount) {
        return this.with((url) => ({ host: url.host.split(".").splice(removeSegmentsCount).join(".") }));
    }
    with(urlUpdate) {
        const update = typeof urlUpdate === "function" ? urlUpdate(this.url) : urlUpdate;
        const addSlashToPath = update.pathname && update.pathname.length > 0 && !update.pathname.startsWith("/");
        if (addSlashToPath) {
            update.pathname = "/" + update.pathname;
        }
        const result = Object.assign(new URL(this.toString()), update);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return new CodestackHostUrl(result);
    }
    withApi(urlUpdate) {
        const updated = urlUpdate ? this.with(urlUpdate) : this;
        return updated.with((url) => ({ pathname: `/api${url.pathname}` }));
    }
    withContext(contextUrl, startOptions) {
        const searchParams = new URLSearchParams();
        if (startOptions === null || startOptions === void 0 ? void 0 : startOptions.showOptions) {
            searchParams.append("showOptions", "true");
        }
        return this.with((url) => ({ hash: contextUrl, search: searchParams.toString() }));
    }
    asWebsocket() {
        return this.with((url) => ({ protocol: url.protocol === "https:" ? "wss:" : "ws:" }));
    }
    asWorkspacePage() {
        return this.with((url) => ({ pathname: "/workspaces" }));
    }
    asDashboard() {
        return this.with((url) => ({ pathname: "/" }));
    }
    asBilling() {
        return this.with((url) => ({ pathname: "/user/billing" }));
    }
    asLogin() {
        return this.with((url) => ({ pathname: "/login" }));
    }
    asAccessControl() {
        return this.with((url) => ({ pathname: "/user/integrations" }));
    }
    asSettings() {
        return this.with((url) => ({ pathname: "/user/account" }));
    }
    asPreferences() {
        return this.with((url) => ({ pathname: "/user/preferences" }));
    }
    asStart(workspaceId = this.workspaceId) {
        return this.with({
            pathname: "/start/",
            hash: "#" + workspaceId,
        });
    }
    asWorkspaceAuth(instanceID) {
        return this.with((url) => ({
            pathname: `/api/auth/workspace-cookie/${instanceID}`,
        }));
    }
    toString() {
        return this.url.toString();
    }
    toStringWoRootSlash() {
        let result = this.toString();
        if (result.endsWith("/")) {
            result = result.slice(0, result.length - 1);
        }
        return result;
    }
    get debugWorkspace() {
        var _a;
        return ((_a = this.url.host.match(workspaceUrlPrefixRegex)) === null || _a === void 0 ? void 0 : _a[2]) === "debug";
    }
    get workspaceId() {
        const hostSegs = this.url.host.split(".");
        if (hostSegs.length > 1) {
            const matchResults = hostSegs[0].match(workspaceIDRegex);
            if (matchResults) {
                // URL has a workspace prefix
                // port prefixes are excluded
                return matchResults[1];
            }
        }
        const pathSegs = this.url.pathname.split("/");
        if (pathSegs.length > 3 && pathSegs[1] === "workspace") {
            return pathSegs[2];
        }
        const cleanHash = this.url.hash.replace(/^#/, "");
        if (this.url.pathname == "/start/" && cleanHash.match(workspaceIDRegex)) {
            return cleanHash;
        }
        return undefined;
    }
    get blobServe() {
        const hostSegments = this.url.host.split(".");
        if (hostSegments[0] === "blobserve") {
            return true;
        }
        const pathSegments = this.url.pathname.split("/");
        return pathSegments[0] === "blobserve";
    }
    asSorry(message) {
        return this.with({ pathname: "/sorry", hash: message });
    }
    asApiLogout() {
        return this.withApi((url) => ({ pathname: "/logout/" }));
    }
    asIDEProxy() {
        const hostSegments = this.url.host.split(".");
        if (hostSegments[0] === "ide") {
            return this;
        }
        return this.with((url) => ({ host: "ide." + url.host }));
    }
    asPublicServices() {
        const hostSegments = this.url.host.split(".");
        if (hostSegments[0] === "services") {
            return this;
        }
        return this.with((url) => ({ host: "services." + url.host }));
    }
    asIDEMetrics() {
        let newUrl = this;
        const hostSegments = this.url.host.split(".");
        if (hostSegments[0] !== "ide") {
            newUrl = newUrl.asIDEProxy();
        }
        return newUrl.with((url) => ({ pathname: "/metrics-api" }));
    }
    asLoginWithOTS(userId, key, returnToUrl) {
        const result = this.withApi({ pathname: `/login/ots/${userId}/${key}` });
        if (returnToUrl) {
            return result.with({ search: `returnTo=${encodeURIComponent(returnToUrl)}` });
        }
        return result;
    }
}
exports.CodestackHostUrl = CodestackHostUrl;
//# sourceMappingURL=codestack-host-url.js.map