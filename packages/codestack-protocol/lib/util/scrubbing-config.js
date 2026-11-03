"use strict";
/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactedValues = exports.hashedValues = exports.hashedFields = exports.redactedFields = void 0;
// redactedFields are the names of fields we'll redact when matched
exports.redactedFields = ["auth_", "password", "token", "key", "jwt", "secret", "email"];
// hashedFields are the names of fields we'll hash if matched
exports.hashedFields = ["contextURL", "workspaceID", "username"];
// hashedValues are regular expressions which when matched cause the entire value to be hashed
exports.hashedValues = new Map([["url", /https?:\/\/[^\s]+\.git\b/g]]);
// redactedValues are regular expressions which when matched cause the entire value to be redacted
exports.redactedValues = new Map([
    // https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
    [
        "email",
        new RegExp(/[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/, "g"),
    ],
]);
//# sourceMappingURL=scrubbing-config.js.map