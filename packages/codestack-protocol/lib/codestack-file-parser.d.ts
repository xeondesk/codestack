/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { WorkspaceConfig } from "./protocol";
export type MaybeConfig = WorkspaceConfig | undefined;
export interface ParseResult {
    config: WorkspaceConfig;
    parsedConfig?: WorkspaceConfig;
    validationErrors?: string[];
}
export declare class CodestackFileParser {
    parse(content: string, parseOptions?: {}, defaultConfig?: WorkspaceConfig): ParseResult;
}
//# sourceMappingURL=codestack-file-parser.d.ts.map