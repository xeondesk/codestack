"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALUE = exports.NAME = void 0;
exports.options = options;
exports.generateCookie = generateCookie;
exports.isPresent = isPresent;
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
const cookie = __importStar(require("cookie"));
/**
 * This cookie indicates whether the connected client is a Codestack user (= "has logged in within the last year") or not.
 * This is used by "codestack.io" and "www.codestack.io" to display different content/buttons.
 */
exports.NAME = "codestack-user";
exports.VALUE = "true";
/**
 * @param domain The domain the Codestack installation is installed onto
 * @returns
 */
function options(domain) {
    // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    return {
        path: "/", // make sure we send the cookie to all sub-pages
        httpOnly: false,
        secure: false,
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax", // default: true. "Lax" needed to ensure we see cookies from users that navigate to codestack.io from external sites
        domain: `.${domain}`, // explicitly include subdomains to not only cover "codestack.io", but also "www.codestack.io" or workspaces
    };
}
function generateCookie(domain) {
    return cookie.serialize(exports.NAME, exports.VALUE, options(domain));
}
function isPresent(cookies) {
    // needs to match the old (codestack-user=loggedIn) and new (codestack-user=true) values to ensure a smooth transition during rollout.
    return !!cookies.match(`${exports.NAME}=`);
}
//# sourceMappingURL=codestack-cookie.js.map