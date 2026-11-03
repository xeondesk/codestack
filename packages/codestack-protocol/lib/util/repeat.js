"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeat = repeat;
const __1 = require("..");
const logging_1 = require("./logging");
/**
 * This intends to be a drop-in replacement for 'setInterval' implemented with a 'setTimeout' chain
 * to ensure we're not creating more timeouts than we can process.
 * @param op
 * @param everyMilliseconds
 * @returns
 */
function repeat(op, everyMilliseconds) {
    let timer = undefined;
    let stopped = false;
    const repeated = () => {
        if (stopped) {
            // in case we missed the clearTimeout i 'await'
            return;
        }
        timer = setTimeout(async () => {
            try {
                await op();
            }
            catch (err) {
                // catch error here to
                logging_1.log.error(err);
            }
            repeated(); // chain ourselves - after the 'await'
        }, everyMilliseconds);
    };
    repeated();
    return __1.Disposable.create(() => {
        stopped = true;
        if (timer) {
            clearTimeout(timer);
        }
    });
}
//# sourceMappingURL=repeat.js.map