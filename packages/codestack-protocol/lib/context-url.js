"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextURL = void 0;
/**
 * The whole point of these methods is to overcome inconsistencies in our data model.
 * Ideally we remove it at some point once we fixed our model, as it:
 *  - duplicates logic
 *  - but additional burden on clients (using this, copying this to other languages!)
 *
 * TODO(gpl) See if we can get this into `server` code to remove the burden from clients
 */
var ContextURL;
(function (ContextURL) {
    ContextURL.IMAGEBUILD_PREFIX = "imagebuild";
    ContextURL.SNAPSHOT_PREFIX = "snapshot";
    ContextURL.REFERRER_PREFIX = "referrer:";
    /**
     * This function will (try to) return the HTTP(S) URL of the context the user originally created this workspace on.
     * Especially it will not contain any modifiers or be of different scheme than HTTP(S).
     *
     * Use this function if you need to provided a _working_ URL to the original context.
     * @param ws
     * @returns
     */
    function getNormalizedURL(ws) {
        const normalized = normalize(ws);
        if (!normalized) {
            return undefined;
        }
        try {
            return new URL(normalized);
        }
        catch (err) {
            console.debug(`unable to parse URL from normalized contextURL: '${normalized}'`);
        }
        return undefined;
    }
    ContextURL.getNormalizedURL = getNormalizedURL;
    function normalize(ws) {
        if (!ws) {
            return undefined;
        }
        if (ws.context.normalizedContextURL) {
            return ws.context.normalizedContextURL;
        }
        // fallback: we do not yet set normalizedContextURL on all workspaces, yet, let alone older existing workspaces
        let fallback = undefined;
        try {
            fallback = removePrefixes(ws.contextURL);
        }
        catch (err) {
            console.error(`unable to remove prefixes from contextURL: '${ws.contextURL}'`, err);
        }
        return fallback;
    }
    ContextURL.normalize = normalize;
    /**
     * The field "contextUrl" might contain prefixes like:
     *  - envvar1=value1/...
     *  - prebuild/...
     * This is the analogon to the (Prefix)ContextParser structure in "server".
     */
    function removePrefixes(contextUrl) {
        if (contextUrl === undefined) {
            return undefined;
        }
        const segments = contextUrl.split("/");
        if (segments.length === 1) {
            return segments[0]; // this might be something, we just try
        }
        const segmentsToURL = (offset) => {
            let rest = segments.slice(offset).join("/");
            if (/^git@[^:\/]+:/.test(rest)) {
                rest = rest.replace(/^git@([^:\/]+):/, "https://$1/");
            }
            if (!rest.startsWith("http")) {
                rest = "https://" + rest;
            }
            return rest;
        };
        const firstSegment = segments[0];
        if (firstSegment === ContextURL.IMAGEBUILD_PREFIX ||
            firstSegment === ContextURL.SNAPSHOT_PREFIX ||
            firstSegment.startsWith(ContextURL.REFERRER_PREFIX)) {
            return segmentsToURL(1);
        }
        // check for env vars
        if (firstSegment.indexOf("=") !== -1) {
            return segmentsToURL(1);
        }
        return segmentsToURL(0);
    }
})(ContextURL || (exports.ContextURL = ContextURL = {}));
//# sourceMappingURL=context-url.js.map