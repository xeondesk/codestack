"use strict";
/**
 * Copyright (c) 2024 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeout = void 0;
/**
 * A restartable timeout, based on an AbortController + setTimeout.
 *
 * Note: When cleared/reset, the AbortController is _NOT_ aborted.
 */
class Timeout {
    /**
     * @param timeout The timeout in milliseconds.
     * @param abortCondition An optional condition evaluated on timeout: If set, the abort is only emitted if it evaluates to true.
     */
    constructor(timeout, abortCondition) {
        this.timeout = timeout;
        this.abortCondition = abortCondition;
    }
    /**
     * Starts a new timeout (and clears the old one). Identical to `reset`.
     */
    start() {
        this.restart();
    }
    /**
     * Starts a new timeout (and clears the old one).
     */
    restart() {
        this.clear();
        const abortController = new AbortController();
        this._abortController = abortController;
        if (this.timeout === Infinity) {
            return;
        }
        this._timer = setTimeout(() => {
            if (this.abortCondition && !this.abortCondition()) {
                return;
            }
            abortController.abort();
        }, this.timeout);
    }
    /**
     * Clears the current timeout.
     */
    clear() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }
        if (this._abortController) {
            this._abortController = undefined;
        }
    }
    /**
     * Convenience method to await the timeout.
     * @returns
     */
    async await() {
        const abortController = this._abortController;
        if (!abortController) {
            return false;
        }
        return new Promise((resolve) => {
            abortController.signal.addEventListener("abort", () => resolve(true));
        });
    }
    /**
     * @returns The AbortSignal of the current timeout, if one is active.
     */
    get signal() {
        var _a;
        return (_a = this._abortController) === null || _a === void 0 ? void 0 : _a.signal;
    }
}
exports.Timeout = Timeout;
//# sourceMappingURL=timeout.js.map