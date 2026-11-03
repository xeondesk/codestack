"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncCachingIteratorImpl = void 0;
exports.find = find;
exports.filter = filter;
// Use asyncIterators with es2015
if (typeof Symbol.asyncIterator === "undefined") {
    Symbol.asyncIterator = Symbol.asyncIterator || Symbol("asyncIterator");
}
async function find(it, predicate) {
    for await (const t of it) {
        if (predicate(t)) {
            return t;
        }
    }
    return undefined;
}
async function filter(it, predicate) {
    const result = [];
    for await (const t of it) {
        if (predicate(t)) {
            result.push(t);
        }
    }
    return result;
}
class AsyncCachingIteratorImpl {
    constructor(iterable) {
        this.iterable = iterable;
        this.cache = [];
        this.cursor = 0;
        this.cacheRead = false;
    }
    resetCursor() {
        this.cursor = 0;
        this.cacheRead = false;
    }
    async next(value) {
        if (!this.cacheRead && this.cursor < this.cache.length) {
            return {
                done: false,
                value: this.cache[this.cursor++],
            };
        }
        this.cacheRead = true;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const result = await this.iterable.next(value);
        if (!result.done) {
            this.cache.push(result.value);
        }
        return result;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
}
exports.AsyncCachingIteratorImpl = AsyncCachingIteratorImpl;
//# sourceMappingURL=async-iterator.js.map