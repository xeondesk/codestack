"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
class Semaphore {
    constructor(capacity) {
        this.capacity = capacity;
        this.queue = [];
        if (capacity < 1) {
            throw new Error("Capacity cannot be less than 1");
        }
    }
    release() {
        if (this.used == 0)
            return;
        const queued = this.queue.shift();
        if (queued) {
            queued();
        }
        this.used--;
    }
    async acquire() {
        this.used++;
        if (this.used <= this.capacity) {
            return Promise.resolve();
        }
        return new Promise((rs, rj) => {
            this.queue.push(rs);
        });
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=semaphore.js.map