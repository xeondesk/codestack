/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { Workspace } from ".";
/**
 * The whole point of these methods is to overcome inconsistencies in our data model.
 * Ideally we remove it at some point once we fixed our model, as it:
 *  - duplicates logic
 *  - but additional burden on clients (using this, copying this to other languages!)
 *
 * TODO(gpl) See if we can get this into `server` code to remove the burden from clients
 */
export declare namespace ContextURL {
    const IMAGEBUILD_PREFIX = "imagebuild";
    const SNAPSHOT_PREFIX = "snapshot";
    const REFERRER_PREFIX = "referrer:";
    /**
     * This function will (try to) return the HTTP(S) URL of the context the user originally created this workspace on.
     * Especially it will not contain any modifiers or be of different scheme than HTTP(S).
     *
     * Use this function if you need to provided a _working_ URL to the original context.
     * @param ws
     * @returns
     */
    function getNormalizedURL(ws: Pick<Workspace, "context" | "contextURL"> | undefined): URL | undefined;
    function normalize(ws: Pick<Workspace, "context" | "contextURL"> | undefined): string | undefined;
}
//# sourceMappingURL=context-url.d.ts.map