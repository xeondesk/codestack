"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLink = makeLink;
function isOpenNewTab(event) {
    return event.metaKey || event.ctrlKey;
}
function makeLink(node, url, hover) {
    node.onclick = (event) => {
        let target = "_self";
        if (isOpenNewTab(event)) {
            target = "_blank";
        }
        window.open(url, target);
    };
    node.style.cursor = "pointer";
    node.title = hover;
}
//# sourceMappingURL=make-link.js.map