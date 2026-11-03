/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { Disposable } from "..";
/**
 * This intends to be a drop-in replacement for 'setInterval' implemented with a 'setTimeout' chain
 * to ensure we're not creating more timeouts than we can process.
 * @param op
 * @param everyMilliseconds
 * @returns
 */
export declare function repeat(op: () => Promise<void> | void, everyMilliseconds: number): Disposable;
//# sourceMappingURL=repeat.d.ts.map