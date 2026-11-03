"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = void 0;
class Deferred {
    constructor(timeout) {
        this.isResolved = false;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = (o) => {
                this.isResolved = true;
                resolve(o);
                clearTimeout(this.timer);
            };
            this.reject = (e) => {
                reject(e);
                clearTimeout(this.timer);
            };
        });
        if (timeout) {
            this.timer = setTimeout(() => this.reject(new Error(`Timeout of ${timeout} ms.`)), timeout);
        }
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=deferred.js.map