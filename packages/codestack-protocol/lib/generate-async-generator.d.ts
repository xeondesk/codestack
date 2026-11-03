/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { Queue } from "event-iterator/lib/event-iterator";
/**
 * Generates an asynchronous generator that yields values based on the provided setup function.
 *
 * the setup function that takes a queue and returns a cleanup function.
 * `queue.next` method that accepts a value to be pushed to the generator.
 *
 * remember that setup callback MUST wrap with try catch and use `queue.fail` to propagate error
 *
 * Iterator will always at least end with throw an `Abort error`
 */
export declare function generateAsyncGenerator<T>(setup: (queue: Queue<T>) => (() => void) | void, opts: {
    signal: AbortSignal;
}): AsyncIterable<T>;
//# sourceMappingURL=generate-async-generator.d.ts.map