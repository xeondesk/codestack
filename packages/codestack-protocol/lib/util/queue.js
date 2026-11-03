"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const deferred_1 = require("./deferred");
/**
 * Queues asynchronous operations in a synchronous context
 */
class Queue {
    constructor() {
        this.queue = Promise.resolve();
    }
    enqueue(operation) {
        const enqueue = new deferred_1.Deferred();
        this.queue = this.queue.then(async () => {
            try {
                const result = await operation();
                enqueue.resolve(result);
            }
            catch (err) {
                enqueue.reject(err);
            }
        });
        return enqueue.promise;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map