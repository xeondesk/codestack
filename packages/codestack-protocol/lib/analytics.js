"use strict";
/**
 * Copyright (c) 2021 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullAnalyticsWriter = exports.IAnalyticsWriter = void 0;
exports.IAnalyticsWriter = Symbol("IAnalyticsWriter");
exports.NullAnalyticsWriter = {
    identify(msg) {
        // noop
    },
    track(msg) {
        // noop
    },
    page(msg) {
        // noop
    },
};
//# sourceMappingURL=analytics.js.map