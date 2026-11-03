/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import * as cookie from "cookie";
/**
 * This cookie indicates whether the connected client is a Codestack user (= "has logged in within the last year") or not.
 * This is used by "codestack.io" and "www.codestack.io" to display different content/buttons.
 */
export declare const NAME = "codestack-user";
export declare const VALUE = "true";
/**
 * @param domain The domain the Codestack installation is installed onto
 * @returns
 */
export declare function options(domain: string): cookie.CookieSerializeOptions;
export declare function generateCookie(domain: string): string;
export declare function isPresent(cookies: string): boolean;
//# sourceMappingURL=codestack-cookie.d.ts.map