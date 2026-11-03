/*---------------------------------------------------------------------------------------------
 *  Copyright (c) CodeStack. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import { CodeStackExtensionContext, ExposedServedCodeStackWorkspacePort, CodeStackWorkspacePort, isExposedServedCodeStackWorkspacePort, isExposedServedPort, PortInfo, TunnelDescriptionI } from 'codestack-shared';
import { PortsStatus, PortProtocol, PortVisibility } from '@codestack/supervisor-api-grpc/lib/status_pb';
import { TunnelVisiblity } from '@codestack/supervisor-api-grpc/lib/port_pb';

const PortCommands = <const>['tunnelNetwork', 'tunnelHost', 'makePublic', 'makePrivate', 'preview', 'openBrowser', 'retryAutoExpose', 'urlCopy', 'queryPortData'];

type PortCommand = typeof PortCommands[number];

interface PortItem { port: CodeStackWorkspacePort }

const supportedCommands = [...PortCommands].filter(e => e !== 'preview');

export class CodeStackPortViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'codestack.portsView';

	private _view?: vscode.WebviewView;

	readonly portMap = new Map<number, CodeStackWorkspacePort>();

	private readonly onDidExposeServedPortEmitter = new vscode.EventEmitter<ExposedServedCodeStackWorkspacePort>();
	readonly onDidExposeServedPort = this.onDidExposeServedPortEmitter.event;


	private readonly onDidChangePortsEmitter = new vscode.EventEmitter<Map<number, CodeStackWorkspacePort>>();
	readonly onDidChangePorts = this.onDidChangePortsEmitter.event;

	constructor(private readonly context: CodeStackExtensionContext) {
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.makePrivate', ({ port }: PortItem) => {
			context.telemetryService.sendTelemetryEvent('vscode_execute_command_codestack_ports', {
				...context.getWorkspaceTelemetryProperties(),
				action: 'private'
			});
			context.controlPort(port.status.localPort, port.status.exposed, { visibility: PortVisibility.PRIVATE });
		}));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.makePublic', ({ port }: PortItem) => {
			context.telemetryService.sendTelemetryEvent('vscode_execute_command_codestack_ports', {
				...context.getWorkspaceTelemetryProperties(),
				action: 'public'
			});
			context.controlPort(port.status.localPort, port.status.exposed, { visibility: PortVisibility.PUBLIC });
		}));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.makeHTTPS', ({ port }: PortItem) => {
			context.telemetryService.sendTelemetryEvent('vscode_execute_command_codestack_ports', {
				...context.getWorkspaceTelemetryProperties(),
				action: 'https'
			});
			context.controlPort(port.status.localPort, port.status.exposed, { protocol: PortProtocol.HTTPS });
		}));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.makeHTTP', ({ port }: PortItem) => {
			context.telemetryService.sendTelemetryEvent('vscode_execute_command_codestack_ports', {
				...context.getWorkspaceTelemetryProperties(),
				action: 'http'
			});
			context.controlPort(port.status.localPort, port.status.exposed, { protocol: PortProtocol.HTTP });
		}));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.preview', ({ port }: PortItem) => {
			context.telemetryService.sendTelemetryEvent('vscode_execute_command_codestack_ports', {
				...context.getWorkspaceTelemetryProperties(),
				action: 'preview'
			});
			vscode.commands.executeCommand('simpleBrowser.api.open', port.externalUrl.toString(), {
				viewColumn: vscode.ViewColumn.Beside,
				preserveFocus: true
			});
		}));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.openBrowser', ({ port }: PortItem) => {
			context.telemetryService.sendTelemetryEvent('vscode_execute_command_codestack_ports', {
				...context.getWorkspaceTelemetryProperties(),
				action: 'openBrowser'
			});
			vscode.env.openExternal(vscode.Uri.parse(port.externalUrl));
		}));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.tunnelNetwork', ({ port }: PortItem) => {
			context.supervisor.setTunnelVisibility(port.portNumber, port.portNumber, TunnelVisiblity.NETWORK);
		}));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.tunnelHost', async ({ port }: PortItem) =>
			context.supervisor.setTunnelVisibility(port.portNumber, port.portNumber, TunnelVisiblity.HOST)
		));
		context.subscriptions.push(vscode.commands.registerCommand('codestack.ports.retryAutoExpose', ({ port }: PortItem) => {
			context.supervisor.retryAutoExposePort(port.portNumber);
		}));
	 }

	// @ts-ignore
	resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
		this._view = webviewView;
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this.context.extensionUri],
		};
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
		webviewView.onDidChangeVisibility(() => {
			if (!webviewView.visible) {
				return;
			}
			this.updateHtml();
		});
		this.onHtmlCommand();
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'public', 'codicon.css'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'public', 'portsview.css'));
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'public', 'portsview.js'));
		const nonce = getNonce();
		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />

	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link href="${codiconsUri}" rel="stylesheet" />
	<link href="${styleUri}" rel="stylesheet" />
	<title>CodeStack Port View</title>
</head>
<body></body>
<script nonce="${nonce}" src="${scriptUri}"></script>
</html>`;
	}

	private tunnelsMap = new Map<number, TunnelDescriptionI>();
	updateTunnels(tunnelsMap: Map<number, TunnelDescriptionI>): void {
		this.tunnelsMap = tunnelsMap;
		this.update();
	}

	private portStatus: PortsStatus.AsObject[] | undefined;
	updatePortsStatus(portsStatus: PortsStatus.AsObject[]): void {
		this.portStatus = portsStatus;
		this.update();
	}

	private updating = false;
	private update(): void {
		if (this.updating) { return; }
		this.updating = true;
		try {
			if (!this.portStatus) { return; }
			this.portStatus.forEach(e => {
				const localPort = e.localPort;
				const tunnel = this.tunnelsMap.get(localPort);
				let codestackPort = this.portMap.get(localPort);
				const prevStatus = codestackPort?.status;
				if (!codestackPort) {
					codestackPort = new CodeStackWorkspacePort(localPort, e, tunnel);
					this.portMap.set(localPort, codestackPort);
				} else {
					codestackPort.update(e, tunnel);
				}
				if (isExposedServedCodeStackWorkspacePort(codestackPort) && !isExposedServedPort(prevStatus)) {
					this.onDidExposeServedPortEmitter.fire(codestackPort);
				}
			});
			this.onDidChangePortsEmitter.fire(this.portMap);
			this.updateHtml();
		} finally {
			this.updating = false;
		}
	}

	private updateHtml(): void {
		this._view?.webview.postMessage({ command: 'supportedCommands', commands: supportedCommands });
		const ports = Array.from(this.portMap.values()).map(e => e.toSvelteObject());
		this._view?.webview.postMessage({ command: 'updatePorts', ports });
	}

	private onHtmlCommand() {
		this._view?.webview.onDidReceiveMessage(async (message: { command: PortCommand; port: { info: PortInfo; status: PortsStatus.AsObject } }) => {
			if (message.command === 'queryPortData') {
				this.updateHtml();
				return;
			}
			const port = this.portMap.get(message.port.status.localPort);
			if (!port) { return; }
			if (message.command === 'urlCopy' && port.status.exposed) {
				await vscode.env.clipboard.writeText(port.status.exposed.url);
				this.context.telemetryService.sendTelemetryEvent('vscode_execute_command_codestack_ports', {
					...this.context.getWorkspaceTelemetryProperties(),
					action: 'urlCopy'
				});
				return;
			}
			vscode.commands.executeCommand('codestack.ports.' + message.command, { port });
		});
	}
}

function getNonce() {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
