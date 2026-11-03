/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
interface Window {
    codestack: {
        ideService?: import("../ide-frontend-service").IDEFrontendService;
        loggedUserID?: string;
        openDesktopIDE(url: string): void;
        encrypt(content: string): string;
        decrypt(content: string): string;
        isEncryptedData(content: string): boolean;
    };
}
//# sourceMappingURL=globals.d.ts.map