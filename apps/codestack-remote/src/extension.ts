/*---------------------------------------------------------------------------------------------
 *  Copyright (c) CodeStack. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { CodeStackExtensionContext, registerTasks, setupCodeStackContext, registerIpcHookCli } from 'codestack-shared';
import * as path from 'path';
import * as vscode from 'vscode';
import { configureMachineSettings } from './machineSettings';
import { tunnelPorts } from './ports';
import { CodeStackPortViewProvider } from './portViewProvider';
import { initializeRemoteExtensions, installInitialExtensions, ISyncExtension } from './remoteExtensionInit';

let initialExtensionsInstallPromise: Promise<void>;
let codestackContext: CodeStackExtensionContext | undefined;
export async function activate(context: vscode.ExtensionContext) {
	codestackContext = await setupCodeStackContext(context);
	if (!codestackContext) {
		return;
	}

	registerCommands(codestackContext);
	registerTasks(codestackContext);
	initialExtensionsInstallPromise = installInitialExtensions(codestackContext);

	const portViewProvider = new CodeStackPortViewProvider(codestackContext);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(CodeStackPortViewProvider.viewType, portViewProvider, { webviewOptions: { retainContextWhenHidden: true } }));

	let initial = true;
	context.subscriptions.push(codestackContext.supervisor.onDidChangePortStatus(portList => {
		const promise = configureMachineSettings(codestackContext!, portList);
		if (initial) {
			initial = false;
			promise.then(() => tunnelPorts(portList));
		} else {
			// Manually tunnel for now until fixing vscode bug where `remote.autoForwardPortsSource` is not respected on first connection
			tunnelPorts(portList)
		}
		portViewProvider.updatePortsStatus(portList);
	}));
	codestackContext.supervisor.startObservePortsStatus();

	registerCLI(codestackContext);
	// configure task terminals if CodeStack Code Server is running
	if (process.env.CODESTACK_THEIA_PORT) {
		registerIpcHookCli(codestackContext);
	}

	// For port tunneling we rely on Remote SSH capabilities
	// and codestack.codestack to disable auto tunneling from the current local machine.
	vscode.commands.executeCommand('codestack.api.autoTunnel', codestackContext.info.codestackHost, codestackContext.info.instanceId, false);

	// TODO
	// - auth?
	// - .codestack.yml validations
	// - add to .codestack.yml command
	// - cli integration
	//   - git credential helper
	await codestackContext.active;
}

export async function deactivate() {
	await codestackContext?.dispose();
}

/**
 * configure CLI in regular terminals
 */
function registerCLI(context: CodeStackExtensionContext): void {
	context.environmentVariableCollection.replace('EDITOR', 'code');
	context.environmentVariableCollection.replace('VISUAL', 'code');
	context.environmentVariableCollection.replace('GP_OPEN_EDITOR', 'code');
	context.environmentVariableCollection.replace('GIT_EDITOR', 'code --wait');
	context.environmentVariableCollection.replace('GP_PREVIEW_BROWSER', `${process.execPath} ${path.join(__dirname, 'cli.js')} --preview`);
	context.environmentVariableCollection.replace('GP_EXTERNAL_BROWSER', 'code --openExternal');

	const ipcHookCli = context.ipcHookCli;
	if (!ipcHookCli) {
		return;
	}
	context.environmentVariableCollection.replace('CODESTACK_REMOTE_CLI_IPC', ipcHookCli);
}

function registerCommands(context: CodeStackExtensionContext) {
	// For collecting logs, will be called by codestack-desktop extension;
	context.subscriptions.push(vscode.commands.registerCommand('__codestack.getCodeStackRemoteLogsUri', () => {
		return context.logUri;
	}));

	// Initialize remote extensions
	context.subscriptions.push(vscode.commands.registerCommand('__codestack.initializeRemoteExtensions', async (extensions: ISyncExtension[]) => {
		try {
			// Await for initial extension instalation so we don't have too many extension installations tasks running
			await initialExtensionsInstallPromise;
		} catch {
		}
		return initializeRemoteExtensions(extensions, codestackContext!);
	}));
}
