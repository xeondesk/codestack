"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarbageCollectedCache = void 0;
const repeat_1 = require("./repeat");
class GarbageCollectedCache {
    constructor(defaultMaxAgeSeconds, gcIntervalSeconds) {
        this.defaultMaxAgeSeconds = defaultMaxAgeSeconds;
        this.gcIntervalSeconds = gcIntervalSeconds;
        this.store = new Map();
        this.regularlyCollectGarbage();
    }
    set(key, value) {
        const oldValue = this.store.get(key);
        if (oldValue) {
            // We don't want values to be cached indefinitely just because their queried often
            return;
        }
        this.store.set(key, {
            key,
            value,
            expiryDate: this.calcExpiryDate(),
        });
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry) {
            return undefined;
        }
        // Still valid?
        if (entry.expiryDate < Date.now()) {
            this.store.delete(entry.key);
            return undefined;
        }
        return entry.value;
    }
    delete(key) {
        this.store.delete(key);
    }
    regularlyCollectGarbage() {
        (0, repeat_1.repeat)(() => this.collectGarbage(), this.gcIntervalSeconds * 1000);
    }
    collectGarbage() {
        const now = Date.now();
        for (const entry of this.store.values()) {
            if (entry.expiryDate < now) {
                this.store.delete(entry.key);
            }
        }
    }
    calcExpiryDate(maxAgeSeconds) {
        return Date.now() + (maxAgeSeconds || this.defaultMaxAgeSeconds) * 1000;
    }
}
exports.GarbageCollectedCache = GarbageCollectedCache;
//# sourceMappingURL=garbage-collected-cache.js.map