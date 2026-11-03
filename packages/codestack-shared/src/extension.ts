/*---------------------------------------------------------------------------------------------
 *  Copyright (c) CodeStack. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { registerActiveLanguageAnalytics } from './analytics';
import { createCodeStackExtensionContext, registerDefaultLayout, registerNotifications, registerWorkspaceCommands, registerWorkspaceSharing, registerWorkspaceTimeout } from './features';
import { ValidateService } from './validate';
import { CodeStackExtensionContext } from './codestackContext';

export { CodeStackExtensionContext } from './codestackContext';
export { registerTasks, registerIpcHookCli } from './features';

export * from './common/utils';
export * from './common/dispose';
export { ILogService } from './logService';
export { TelemetryService } from './telemetryService';
export * from './codestack-plugin-model';
export * from './workspacePort';

export async function setupCodeStackContext(context: vscode.ExtensionContext): Promise<CodeStackExtensionContext | undefined> {
	const codestackContext = await createCodeStackExtensionContext(context);
	vscode.commands.executeCommand('setContext', 'codestack.inWorkspace', !!codestackContext);
	if (!codestackContext) {
		return undefined;
	}

	logContextInfo(codestackContext);

	vscode.commands.executeCommand('setContext', 'codestack.ideAlias', codestackContext.info.ideAlias);
	vscode.commands.executeCommand('setContext', 'codestack.UIKind', vscode.env.uiKind === vscode.UIKind.Web ? 'web' : 'desktop');

	codestackContext.telemetryService.sendTelemetryEvent('vscode_session', {
		...codestackContext.getWorkspaceTelemetryProperties(),
	});


	registerActiveLanguageAnalytics(codestackContext);
	registerWorkspaceCommands(codestackContext);
	registerWorkspaceSharing(codestackContext);
	registerWorkspaceTimeout(codestackContext);
	registerNotifications(codestackContext);
	registerDefaultLayout(codestackContext);
	codestackContext.subscriptions.push(new ValidateService(codestackContext));

	return codestackContext;
}

function logContextInfo(context: CodeStackExtensionContext) {
	context.logger.info(`VSCODE_MACHINE_ID: ${vscode.env.machineId}`);
	context.logger.info(`VSCODE_SESSION_ID: ${vscode.env.sessionId}`);
	context.logger.info(`VSCODE_VERSION: ${vscode.version}`);
	context.logger.info(`VSCODE_APP_NAME: ${vscode.env.appName}`);
	context.logger.info(`VSCODE_APP_HOST: ${vscode.env.appHost}`);
	context.logger.info(`VSCODE_UI_KIND: ${vscode.env.uiKind === vscode.UIKind.Web ? 'web' : 'desktop'}`);

	context.logger.info(`CODESTACK_WORKSPACE_CONTEXT_URL: ${context.info.workspaceContextUrl}`);
	context.logger.info(`CODESTACK_INSTANCE_ID: ${context.info.instanceId}`);
	context.logger.info(`CODESTACK_WORKSPACE_URL: ${context.info.workspaceUrl}`);
}
