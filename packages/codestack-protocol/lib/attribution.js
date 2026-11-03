"use strict";
/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributionId = void 0;
var AttributionId;
(function (AttributionId) {
    const SEPARATOR = ":";
    function createFromOrganizationId(organizationId) {
        return { kind: "team", teamId: organizationId };
    }
    AttributionId.createFromOrganizationId = createFromOrganizationId;
    function create(organization) {
        return createFromOrganizationId(organization.id);
    }
    AttributionId.create = create;
    function parse(s) {
        if (!s) {
            return undefined;
        }
        const parts = s.split(":");
        if (parts.length !== 2) {
            return undefined;
        }
        switch (parts[0]) {
            case "team":
                return { kind: "team", teamId: parts[1] };
        }
        return undefined;
    }
    AttributionId.parse = parse;
    function render(id) {
        switch (id.kind) {
            case "team":
                return `team${SEPARATOR}${id.teamId}`;
        }
        // allthough grayed as unreachable it is reachable at runtime
        throw new Error("invalid attributionId kind : " + id.kind);
    }
    AttributionId.render = render;
    function equals(a, b) {
        return render(a) === render(b);
    }
    AttributionId.equals = equals;
})(AttributionId || (exports.AttributionId = AttributionId = {}));
//# sourceMappingURL=attribution.js.map