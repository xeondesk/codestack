"use strict";
/**
 * Copyright (c) 2023 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAsyncGenerator = generateAsyncGenerator;
const event_iterator_1 = require("event-iterator");
const error_1 = require("./messaging/error");
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
function generateAsyncGenerator(setup, opts) {
    return new event_iterator_1.EventIterator((queue) => {
        opts.signal.addEventListener("abort", () => {
            queue.fail(new error_1.ApplicationError(error_1.ErrorCodes.CANCELLED, "cancelled"));
        });
        const dispose = setup(queue);
        return () => {
            if (dispose) {
                dispose();
            }
        };
    });
}
//# sourceMappingURL=generate-async-generator.js.map