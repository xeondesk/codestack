/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { BillingTier } from "../protocol";
export declare const Client: unique symbol;
export interface Attributes {
    user?: {
        id: string;
        email?: string;
    };
    billingTier?: BillingTier;
    projectId?: string;
    teamId?: string;
    teamName?: string;
    codestackHost?: string;
}
export interface Client {
    getValueAsync<T>(experimentName: string, defaultValue: T, attributes: Attributes): Promise<T>;
    dispose(): void;
}
//# sourceMappingURL=types.d.ts.map