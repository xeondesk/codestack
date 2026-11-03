"use strict";
/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCatClient = exports.CODESTACK_HOST = exports.BILLING_TIER_ATTRIBUTE = exports.TEAM_NAME_ATTRIBUTE = exports.TEAM_ID_ATTRIBUTE = exports.PROJECT_ID_ATTRIBUTE = exports.USER_ID_ATTRIBUTE = void 0;
exports.attributesToUser = attributesToUser;
const RolloutEvaluator_1 = require("configcat-common/lib/RolloutEvaluator");
exports.USER_ID_ATTRIBUTE = "user_id";
exports.PROJECT_ID_ATTRIBUTE = "project_id";
exports.TEAM_ID_ATTRIBUTE = "team_id";
exports.TEAM_NAME_ATTRIBUTE = "team_name";
exports.BILLING_TIER_ATTRIBUTE = "billing_tier";
exports.CODESTACK_HOST = "codestack_host";
class ConfigCatClient {
    constructor(client, codestackHost) {
        this.client = client;
        this.codestackHost = codestackHost;
    }
    getValueAsync(experimentName, defaultValue, attributes) {
        return this.client.getValueAsync(experimentName, defaultValue, attributesToUser({
            codestackHost: this.codestackHost,
            ...attributes,
        }));
    }
    dispose() {
        return this.client.dispose();
    }
}
exports.ConfigCatClient = ConfigCatClient;
function attributesToUser(attributes) {
    var _a, _b;
    const userId = ((_a = attributes.user) === null || _a === void 0 ? void 0 : _a.id) || "";
    const email = ((_b = attributes.user) === null || _b === void 0 ? void 0 : _b.email) || "";
    const custom = {};
    if (userId) {
        custom[exports.USER_ID_ATTRIBUTE] = userId;
    }
    if (attributes.projectId) {
        custom[exports.PROJECT_ID_ATTRIBUTE] = attributes.projectId;
    }
    if (attributes.teamId) {
        custom[exports.TEAM_ID_ATTRIBUTE] = attributes.teamId;
    }
    if (attributes.teamName) {
        custom[exports.TEAM_NAME_ATTRIBUTE] = attributes.teamName;
    }
    if (attributes.billingTier) {
        custom[exports.BILLING_TIER_ATTRIBUTE] = attributes.billingTier;
    }
    if (attributes.codestackHost) {
        custom[exports.CODESTACK_HOST] = attributes.codestackHost;
    }
    return new RolloutEvaluator_1.User(userId, email, "", custom);
}
//# sourceMappingURL=configcat.js.map