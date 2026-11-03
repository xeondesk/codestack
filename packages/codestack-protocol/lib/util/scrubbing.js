"use strict";
/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrubber = exports.TrustedValue = void 0;
const crypto_1 = require("crypto");
const scrubbing_config_1 = require("./scrubbing-config");
/**
 * `TrustedValue` is a generic wrapper class used to mark certain values as "trusted".
 * This means these values are safe from being scrubbed or redacted by the Scrubber interface.
 * A typical use case is to prepare values for logging or similar uses where data sanitization is required.
 *
 * @see Scrubber to scrub an underlyig value as necessary.
 *
 * @template T - The type of the value being wrapped.
 * @property value - The value being wrapped.
 */
class TrustedValue {
    constructor(value) {
        this.value = value;
    }
}
exports.TrustedValue = TrustedValue;
const SanitiseRedact = (_, options) => {
    if (options === null || options === void 0 ? void 0 : options.key) {
        return `[redacted:${options === null || options === void 0 ? void 0 : options.key}]`;
    }
    return "[redacted]";
};
const SanitiseHash = (value, options) => {
    const hash = (0, crypto_1.createHash)("md5");
    hash.update(value);
    let res = `[redacted:md5:${hash.digest("hex")}`;
    if (options === null || options === void 0 ? void 0 : options.key) {
        res += `:${options === null || options === void 0 ? void 0 : options.key}`;
    }
    res += `]`;
    return res;
};
const regexes = new Map([
    [new RegExp(scrubbing_config_1.redactedFields.join("|"), "i"), SanitiseRedact],
    [new RegExp(scrubbing_config_1.hashedFields.join("|"), "i"), SanitiseHash],
]);
exports.scrubber = {
    scrub: function (obj, nested = true) {
        return doScrub(obj, 0, nested);
    },
    scrubKeyValue: function (key, value) {
        for (const [regex, sanitisatiser] of regexes) {
            if (regex.test(key)) {
                return sanitisatiser(value);
            }
        }
        return value;
    },
    scrubValue: function (value) {
        for (const [key, expr] of scrubbing_config_1.hashedValues.entries()) {
            value = value.replace(expr, (s) => SanitiseHash(s, { key }));
        }
        for (const [key, expr] of scrubbing_config_1.redactedValues.entries()) {
            value = value.replace(expr, (s) => SanitiseRedact(s, { key }));
        }
        return value;
    },
};
function doScrub(obj, depth, nested) {
    if (obj === undefined || obj === null) {
        return undefined;
    }
    if (obj instanceof TrustedValue) {
        return obj.value;
    }
    const objType = typeof obj;
    if (objType === "string") {
        return exports.scrubber.scrubValue(obj);
    }
    if (objType === "boolean" || objType === "number") {
        return obj;
    }
    if (Array.isArray(obj)) {
        if (!nested && depth > 0) {
            return "[redacted:nested:array]";
        }
        return obj.map((v) => doScrub(v, depth + 1, nested));
    }
    if (!nested && depth > 0) {
        return `[redacted:nested:${objType}}]`;
    }
    if (objType === "object") {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === "string") {
                // First apply field-based scrubbing, then pattern-based scrubbing
                let scrubbedValue = exports.scrubber.scrubKeyValue(key, value);
                // If no field-based scrubbing was applied, apply pattern-based scrubbing
                if (scrubbedValue === value) {
                    scrubbedValue = exports.scrubber.scrubValue(value);
                }
                result[key] = scrubbedValue;
            }
            else {
                result[key] = doScrub(value, depth + 1, nested);
            }
        }
        return result;
    }
    return obj;
}
//# sourceMappingURL=scrubbing.js.map