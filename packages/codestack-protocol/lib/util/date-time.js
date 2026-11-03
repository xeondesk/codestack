"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatHours = formatHours;
function formatDate(date) {
    return date ? new Date(date).toLocaleString() : "";
}
function formatHours(hours) {
    if (hours === undefined) {
        return "";
    }
    const h = Math.floor(Math.abs(hours));
    const rm = (Math.abs(hours) - h) * 60;
    const m = Math.floor(rm);
    const rs = (rm - m) * 60;
    const s = Math.floor(rs);
    const result = h + ":" + pad2(m) + ":" + pad2(s);
    if (hours < 0) {
        return `-${result}`;
    }
    else {
        return `${result}`;
    }
}
function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
}
//# sourceMappingURL=date-time.js.map