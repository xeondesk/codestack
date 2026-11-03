/**
 * Copyright (c) 2024 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
/**
 * A restartable timeout, based on an AbortController + setTimeout.
 *
 * Note: When cleared/reset, the AbortController is _NOT_ aborted.
 */
export declare class Timeout {
    readonly timeout: number;
    readonly abortCondition?: (() => boolean) | undefined;
    private _timer;
    private _abortController;
    /**
     * @param timeout The timeout in milliseconds.
     * @param abortCondition An optional condition evaluated on timeout: If set, the abort is only emitted if it evaluates to true.
     */
    constructor(timeout: number, abortCondition?: (() => boolean) | undefined);
    /**
     * Starts a new timeout (and clears the old one). Identical to `reset`.
     */
    start(): void;
    /**
     * Starts a new timeout (and clears the old one).
     */
    restart(): void;
    /**
     * Clears the current timeout.
     */
    clear(): void;
    /**
     * Convenience method to await the timeout.
     * @returns
     */
    await(): Promise<boolean>;
    /**
     * @returns The AbortSignal of the current timeout, if one is active.
     */
    get signal(): AbortSignal | undefined;
}
//# sourceMappingURL=timeout.d.ts.map