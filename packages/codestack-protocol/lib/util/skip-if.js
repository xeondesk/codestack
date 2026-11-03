"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifEnvVarNotSet = ifEnvVarNotSet;
/**
 * Skips a Mocha TestSuite if a certain env var is not set or empty
 * @param name The name of the env var the TestSuite depends on being present
 */
function ifEnvVarNotSet(name) {
    const value = process.env[name];
    const skip = value === undefined || value === "";
    if (skip) {
        console.log(`Skipping suite because env var '${name}' is not set or empty`);
    }
    return skip;
}
//# sourceMappingURL=skip-if.js.map