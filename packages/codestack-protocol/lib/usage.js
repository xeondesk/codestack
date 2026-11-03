"use strict";
/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostCenter_BillingStrategy = exports.Ordering = void 0;
var Ordering;
(function (Ordering) {
    Ordering[Ordering["ORDERING_DESCENDING"] = 0] = "ORDERING_DESCENDING";
    Ordering[Ordering["ORDERING_ASCENDING"] = 1] = "ORDERING_ASCENDING";
})(Ordering || (exports.Ordering = Ordering = {}));
var CostCenter_BillingStrategy;
(function (CostCenter_BillingStrategy) {
    CostCenter_BillingStrategy["BILLING_STRATEGY_STRIPE"] = "BILLING_STRATEGY_STRIPE";
    CostCenter_BillingStrategy["BILLING_STRATEGY_OTHER"] = "BILLING_STRATEGY_OTHER";
    CostCenter_BillingStrategy["UNRECOGNIZED"] = "UNRECOGNIZED";
})(CostCenter_BillingStrategy || (exports.CostCenter_BillingStrategy = CostCenter_BillingStrategy = {}));
//# sourceMappingURL=usage.js.map