"use strict";
/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingMode = void 0;
var BillingMode;
(function (BillingMode) {
    BillingMode.NONE = {
        mode: "none",
    };
    /** Incl. upgrade and status */
    function showUsageBasedBilling(billingMode) {
        return (billingMode === null || billingMode === void 0 ? void 0 : billingMode.mode) === "usage-based";
    }
    BillingMode.showUsageBasedBilling = showUsageBasedBilling;
    function canSetCostCenter(billingMode) {
        return billingMode.mode === "usage-based";
    }
    BillingMode.canSetCostCenter = canSetCostCenter;
})(BillingMode || (exports.BillingMode = BillingMode = {}));
//# sourceMappingURL=billing-mode.js.map