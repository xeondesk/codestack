/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { Organization } from "./teams-projects-protocol";
export type AttributionId = TeamAttributionId;
export type AttributionTarget = "user" | "team";
export interface TeamAttributionId {
    kind: "team";
    teamId: string;
}
export declare namespace AttributionId {
    function createFromOrganizationId(organizationId: string): AttributionId;
    function create(organization: Organization): AttributionId;
    function parse(s: string): AttributionId | undefined;
    function render(id: AttributionId): string;
    function equals(a: AttributionId, b: AttributionId): boolean;
}
//# sourceMappingURL=attribution.d.ts.map