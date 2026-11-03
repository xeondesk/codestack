/*---------------------------------------------------------------------------------------------
 *  Copyright (c) CodeStack. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as path from 'path';
import { CodeStackExtensionContext } from './codestackContext';

const ValidateAction = {
	command: 'codestack.codestackyml.run',
	title: 'Validate',
	description: 'Validate the workspace configuration',
	shellCommand: 'gp validate',

	dockerfileCommand: 'codestack.codestackyml.dockerfile.run',
	dockerfileEditorContextCommand: 'codestack.codestackyml.dockerfile.editorContext.run',
	dockerfileEditorTitleCommand: 'codestack.codestackyml.dockerfile.editorTitle.run',
	editorContextCommand: 'codestack.codestackyml.editorContext.run',
	editorTitleCommand: 'codestack.codestackyml.editorTitle.run',
};
const FeedbackAction = {
	command: 'codestack.codestackyml.feedback',
	title: 'Leave Feedback',
	description: 'Leave feedback on the CodeStack configuration experience',
	url: 'https://github.com/khulnasoft-bot/codestack/issues/7671',

	dockerfileCommand: 'codestack.codestackyml.dockerfile.feedback',
};
const LearnAction = {
	command: 'codestack.codestackyml.learn',
	title: 'Learn More',
	description: 'Learn more about configuring a CodeStack workspace',
	url: 'https://www.codestack.io/docs/configure/workspaces',

	dockerfileCommand: 'codestack.codestackyml.dockerfile.learn',
};

export class ValidateCodelensProvider implements vscode.CodeLensProvider {

	private dockerFileUri: vscode.Uri | undefined;

	constructor() {
	}

	public setDockerFile(uri: vscode.Uri | undefined) {
		this.dockerFileUri = uri;
	}

	public provideCodeLenses(document: vscode.TextDocument, _tkn: vscode.CancellationToken): vscode.CodeLens[] {
		const isDockerFile = document.languageId === "dockerfile";
		if (isDockerFile && (!this.dockerFileUri || document.uri.fsPath !== this.dockerFileUri.fsPath)) {
			return [];
		}

		const text = document.getText();
		const match = /(.+)/.exec(text);
		if (match) {
			const line = document.lineAt(document.positionAt(match.index).line);
			return [
				new vscode.CodeLens(line.range, {
					title: ValidateAction.title,
					tooltip: ValidateAction.description,
					command: isDockerFile ? ValidateAction.dockerfileCommand : ValidateAction.command,
				}),
				new vscode.CodeLens(line.range, {
					title: LearnAction.title,
					tooltip: LearnAction.description,
					command: isDockerFile ? LearnAction.dockerfileCommand : LearnAction.command,
				}),
				new vscode.CodeLens(line.range, {
					title: FeedbackAction.title,
					tooltip: FeedbackAction.description,
					command: isDockerFile ? FeedbackAction.dockerfileCommand : FeedbackAction.command,
				}),
			];
		}
		return [];
	}

	public resolveCodeLens(codeLens: vscode.CodeLens, _tkn: vscode.CancellationToken) {
		return codeLens;
	}
}

export class ValidateService extends vscode.Disposable {
	private disposables: vscode.Disposable[] = [];

	private codelensProvider = new ValidateCodelensProvider();

	private dockerFileUri: vscode.Uri | undefined;

	private async validate() {
		const allTasksExecutions = vscode.tasks.taskExecutions;
		const isTaskRunning = allTasksExecutions.find(task => task.task.source === ValidateAction.command);
		if (isTaskRunning) {
			const restart = 'Restart';
			const terminate = 'Terminate';
			const action = await vscode.window.showWarningMessage(`'${ValidateAction.description}' task is already running`, { modal: true, }, restart, terminate);
			if (!action) {
				return;
			}

			isTaskRunning.terminate();
			if (action === terminate) {
				return;
			}
		}

		await vscode.tasks.executeTask(
			new vscode.Task(
				{ type: 'shell' },
				vscode.TaskScope.Workspace,
				ValidateAction.description,
				ValidateAction.command,
				new vscode.ShellExecution(ValidateAction.shellCommand)));
	}

	constructor(private readonly context: CodeStackExtensionContext) {
		super(() => { });

		this.initialize();
	}

	private async initialize(): Promise<void> {
		if (!(await this.context.experiments.get<boolean>('codestack.experiments.rebuildHints', false))) {
			return;
		}

		await vscode.commands.executeCommand('setContext', 'codestack.rebuild.enabled', true);

		this.updateDockerFile();
		this.disposables.push(this.context.codestackYml.onDidChangeCodeStackYml(() => {
			this.updateDockerFile();
			this.notify('codestackYml');
		}));
		this.disposables.push(vscode.workspace.onDidSaveTextDocument(e => {
			if (this.dockerFileUri && e.uri.fsPath === this.dockerFileUri.fsPath) {
				this.notify('dockerfile');
			}
		}));

		const updateContext = () => {
			const editor = vscode.window.activeTextEditor;
			const isCodeStackDockerfile = !!editor && !!this.dockerFileUri && editor.document.uri.fsPath === this.dockerFileUri.fsPath;
			vscode.commands.executeCommand('setContext', 'codestack.rebuild.dockerfile', isCodeStackDockerfile);
		}
		updateContext();
		this.disposables.push(vscode.window.onDidChangeActiveTextEditor(() => updateContext()));

		this.disposables.push(vscode.languages.registerCodeLensProvider({ pattern: '**/.codestack.yml' }, this.codelensProvider));
		this.disposables.push(vscode.languages.registerCodeLensProvider({ language: 'dockerfile' }, this.codelensProvider));

		this.disposables.push(vscode.commands.registerCommand(ValidateAction.command, async () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'run',
				location: 'codelens',
				source: 'codestackYml'
			});
			await this.validate();
		}));
		this.disposables.push(vscode.commands.registerCommand(LearnAction.command, () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'learn',
				location: 'codelens',
				source: 'codestackYml'
			});
			return vscode.env.openExternal(vscode.Uri.parse(LearnAction.url));
		}));
		this.disposables.push(vscode.commands.registerCommand(FeedbackAction.command, () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'feedback',
				location: 'codelens',
				source: 'codestackYml'
			});
			return vscode.env.openExternal(vscode.Uri.parse(FeedbackAction.url));
		}));

		// Duplicate commands just for analytics
		this.disposables.push(vscode.commands.registerCommand(ValidateAction.dockerfileCommand, async () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'run',
				location: 'codelens',
				source: 'dockerfile'
			});
			await this.validate();
		}));
		this.disposables.push(vscode.commands.registerCommand(LearnAction.dockerfileCommand, () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'learn',
				location: 'codelens',
				source: 'dockerfile'
			});
			return vscode.env.openExternal(vscode.Uri.parse(LearnAction.url));
		}));
		this.disposables.push(vscode.commands.registerCommand(FeedbackAction.dockerfileCommand, () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'feedback',
				location: 'codelens',
				source: 'dockerfile'
			});
			return vscode.env.openExternal(vscode.Uri.parse(FeedbackAction.url));
		}));
		this.disposables.push(vscode.commands.registerCommand(ValidateAction.editorContextCommand, async () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'run',
				location: 'editorContext',
				source: 'codestackYml'
			});
			await this.validate();
		}));
		this.disposables.push(vscode.commands.registerCommand(ValidateAction.dockerfileEditorContextCommand, async () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'run',
				location: 'editorContext',
				source: 'dockerfile'
			});
			await this.validate();
		}));
		this.disposables.push(vscode.commands.registerCommand(ValidateAction.editorTitleCommand, async () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'run',
				location: 'editorTitle',
				source: 'codestackYml'
			});
			await this.validate();
		}));
		this.disposables.push(vscode.commands.registerCommand(ValidateAction.dockerfileEditorTitleCommand, async () => {
			this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
				...this.context.getWorkspaceTelemetryProperties(),
				action: 'run',
				location: 'editorTitle',
				source: 'dockerfile'
			});
			await this.validate();
		}));
	}

	private async updateDockerFile() {
		const yaml = await this.context.codestackYml.getYaml();
		const dockerfile = yaml.document.getIn(['image', 'file']);
		if (dockerfile) {
			const dir = path.posix.dirname(this.context.codestackYml.uri.path);
			this.dockerFileUri = this.context.codestackYml.uri.with({ path: path.join(dir, dockerfile) });
		} else {
			this.dockerFileUri = undefined;
		}
		this.codelensProvider.setDockerFile(this.dockerFileUri);
	}

	private notifyInProgress = false;
	private async notify(source: 'codestackYml' | 'dockerfile') {
		const config = vscode.workspace.getConfiguration('codestack');
		if (config.get<boolean>('validate.neverPrompt', false) || this.notifyInProgress) {
			return;
		}
		this.notifyInProgress = true;
		let action:  'run' | 'feedback' | 'learn' | 'cancel' | 'neverAgain' | undefined;
		try {
			const validate = "Validate";
			const learn = "Learn More";
			const neverAgain = "Don't Show Again";
			const result = await vscode.window.showInformationMessage("Do you want to validate the workspace configuration?", validate, learn, neverAgain);
			if (!result) {
				action = 'cancel';
				return;
			}
			if (result === neverAgain) {
				action = 'neverAgain';
				await config.update('validate.neverPrompt', true, vscode.ConfigurationTarget.Global);
				return;
			}
			this.notifyInProgress = false;

			if (result === 'Learn More') {
				action = 'learn';
				await vscode.env.openExternal(vscode.Uri.parse(LearnAction.url));
			} else {
				action = 'run';
				await this.validate();
			}
		} catch (e) {
			this.context.logger.error("validate: failed to notify;", e);
		} finally {
			if (action) {
				this.context.telemetryService.sendTelemetryEvent('vscode_validate', {
					...this.context.getWorkspaceTelemetryProperties(),
					action,
					location: 'notification',
					source
				});
			}
			this.notifyInProgress = false;
		}
	}

	override dispose() {
		this.disposables.forEach(d => d.dispose());
	}
}
