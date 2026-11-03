/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
/**
 * BillingMode is used to answer the following questions:
 *  - Should UI piece x be displayed for this user/team? (getBillingModeForUser/Team)
 *  - What model should be used to limit this workspace's capabilities (mayStartWorkspace, setTimeout, workspace class, etc...) (getBillingMode(workspaceInstance.attributionId))
 *  - How is a workspace session charged for? (getBillingMode(workspaceInstance.attributionId))
 */
export type BillingMode = None | UsageBased;
export declare namespace BillingMode {
    const NONE: None;
    /** Incl. upgrade and status */
    function showUsageBasedBilling(billingMode?: BillingMode): boolean;
    function canSetCostCenter(billingMode: BillingMode): boolean;
}
/** Payment is disabled */
interface None {
    mode: "none";
}
/** Session is handld with new usage-based logic */
interface UsageBased {
    mode: "usage-based";
    /** True if the org has a paid plan. */
    paid: boolean;
}
export {};
//# sourceMappingURL=billing-mode.d.ts.map