/**
 * Copyright (c) 2022 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
import { Attributes, Client } from "./types";
import { User as ConfigCatUser } from "configcat-common/lib/RolloutEvaluator";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";
export declare const USER_ID_ATTRIBUTE = "user_id";
export declare const PROJECT_ID_ATTRIBUTE = "project_id";
export declare const TEAM_ID_ATTRIBUTE = "team_id";
export declare const TEAM_NAME_ATTRIBUTE = "team_name";
export declare const BILLING_TIER_ATTRIBUTE = "billing_tier";
export declare const CODESTACK_HOST = "codestack_host";
export declare class ConfigCatClient implements Client {
    private readonly client;
    private readonly codestackHost?;
    constructor(client: IConfigCatClient, codestackHost?: string | undefined);
    getValueAsync<T>(experimentName: string, defaultValue: T, attributes: Attributes): Promise<T>;
    dispose(): void;
}
export declare function attributesToUser(attributes: Attributes): ConfigCatUser;
export interface ClassicPaygSunsetConfig {
    enabled: boolean;
    exemptedOrganizations: string[];
}
//# sourceMappingURL=configcat.d.ts.map