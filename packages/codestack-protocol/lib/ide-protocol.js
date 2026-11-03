"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDESettingsVersion = exports.IDEOptions = void 0;
var IDEOptions;
(function (IDEOptions) {
    function asArray(options) {
        return Object.keys(options.options)
            .map((id) => ({ ...options.options[id], id }))
            .sort((a, b) => (a.orderKey || "").localeCompare(b.orderKey || ""));
    }
    IDEOptions.asArray = asArray;
})(IDEOptions || (exports.IDEOptions = IDEOptions = {}));
exports.IDESettingsVersion = "2.2";
//# sourceMappingURL=ide-protocol.js.map