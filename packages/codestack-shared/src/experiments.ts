/*---------------------------------------------------------------------------------------------
 *  Copyright (c) CodeStack. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as configcat from 'configcat-node';
import { ILogService } from './logService';
import { URL } from 'url';
import { Team, User } from '@codestack/codestack-protocol';

const experimentsSection = 'codestack.experiments';

export type EXPERIMENTAL_SETTINGS = |
	'codestack.experiments.rebuildHints' |
	'dataops';

export class ExperimentalSettings {
	private configcatClient: ReturnType<typeof configcat.createClientWithLazyLoad>;
	private codestackHostUrl: URL | undefined;

	constructor(
		key: string,
		context: vscode.ExtensionContext,
		private logger: ILogService,
		codestackHost: string,
		private readonly pendingOwner: Promise<User>,
		private readonly pendingTeams: Promise<Team[]>,
	) {
		try {
			this.codestackHostUrl = new URL(codestackHost);
		} catch {
		}
		this.configcatClient = configcat.createClientWithLazyLoad(key, {
			baseUrl: new URL('/configcat', context.extensionMode === vscode.ExtensionMode.Production ? codestackHost : 'https://codestack-staging.com').href,
			logger: {
				debug(): void { },
				log(): void { },
				info(): void { },
				warn(message: string): void { logger.warn(`ConfigCat: ${message}`); },
				error(message: string): void { logger.error(`ConfigCat: ${message}`); }
			},
			requestTimeoutMs: 1500,
			cacheTimeToLiveSeconds: 60
		});
	}

	async get<T>(key: EXPERIMENTAL_SETTINGS, defaultValue: T): Promise<T> {
		const config = vscode.workspace.getConfiguration(experimentsSection);
		const values = config.inspect<T>(key.substring((experimentsSection + '.').length));
		if (!values) {
			this.logger.error(`Cannot get invalid experimental setting '${key}'`);
			return defaultValue;
		}
		if (values.globalValue !== undefined) {
			// User setting have priority over configcat so return early
			return values.globalValue;
		}
		return this.getExperimentValue<T>(key, defaultValue);
	}

	private async getExperimentValue<T>(key: string, defaultValue: T): Promise<T> {
		const configcatKey = key.replace(/\./g, '_'); // '.' are not allowed in configcat
		const user = await this.pendingOwner;
		const email = user.identities.find((i) => i.primaryEmail)?.primaryEmail;
		const teams = await this.pendingTeams;
		if (teams.length) {
			for (const team of teams) {
				const value = (await this.configcatClient.getValueAsync(configcatKey, defaultValue, this.getConfigcatUser(user.id, email, team.id)));
				if (value != defaultValue) {
					return value as T;
				}
			}
			return defaultValue;
		}
		return this.configcatClient.getValueAsync(configcatKey, defaultValue, this.getConfigcatUser(user.id, email, undefined));
	}

	private getConfigcatUser(userId: string, email: string | undefined, teamId: string | undefined): { identifier: string; email?: string; country?: string; customAttributes: { [key: string]: string } } {
		const attributes: { [key: string]: string } = {
			"user_id": userId
		}
		if (email) {
			attributes["user_email"] = email;
		}
		if (teamId) {
			attributes["team_id"] = teamId;
		}
		if (this.codestackHostUrl) {
			attributes["codestack_host"] = this.codestackHostUrl.host;
		}
		return { identifier: userId, email, country: undefined, customAttributes: attributes };
	}

	dispose(): void {
		this.configcatClient.dispose();
	}
}
