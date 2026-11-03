"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cancelable = void 0;
class Cancelable {
    constructor(activity) {
        this.activity = activity;
    }
    async run() {
        for (let r = await this.activity(this.canceled);; r = await this.activity(this.canceled)) {
            if (this.canceled) {
                return;
            }
            else if (r !== undefined) {
                return r;
            }
        }
    }
    cancel() {
        this.canceled = true;
    }
    dispose() {
        this.cancel();
    }
}
exports.Cancelable = Cancelable;
//# sourceMappingURL=cancelable.js.map