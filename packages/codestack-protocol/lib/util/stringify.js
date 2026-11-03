"use strict";
/**
 * Copyright (c) 2024 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntToJson = void 0;
var BigIntToJson;
(function (BigIntToJson) {
    BigIntToJson.BIGINT_KEY = "bigint:";
    function replacer(key, value) {
        if (typeof value === "bigint") {
            return `${BigIntToJson.BIGINT_KEY}${value.toString()}`;
        }
        return value;
    }
    BigIntToJson.replacer = replacer;
    function reviver(key, value) {
        if (typeof value === "string" && value.startsWith(BigIntToJson.BIGINT_KEY)) {
            const v = value.substring(7);
            return BigInt(v);
        }
        return value;
    }
    BigIntToJson.reviver = reviver;
})(BigIntToJson || (exports.BigIntToJson = BigIntToJson = {}));
//# sourceMappingURL=stringify.js.map