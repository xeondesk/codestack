/*---------------------------------------------------------------------------------------------
 *  Copyright (c) CodeStack. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { CodeStackPluginModel } from './codestack-plugin-model';

export class CodeStackYml extends vscode.Disposable {
	private disposables: vscode.Disposable[] = [];

	private readonly _onDidChangeCodeStackYml = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeStackYml = this._onDidChangeCodeStackYml.event;

	constructor(public readonly uri: vscode.Uri) {
		super(() => { });

		this.disposables.push(vscode.workspace.onDidSaveTextDocument(e => {
			if (e.uri.fsPath === this.uri.fsPath) {
				this.refresh();
			}
		}));
	}

	private refresh() {
		this._onDidChangeCodeStackYml.fire();
	}

	async getRawContent() {
		try {
			const document = await vscode.workspace.openTextDocument(this.uri);
			return document.getText();
		} catch {
			return '';
		}
	}

	async getYaml() {
		return new CodeStackPluginModel(await this.getRawContent());
	}

	async writeContent(content: string) {
		let document: vscode.TextDocument | undefined;
		try {
			document = await vscode.workspace.openTextDocument(this.uri);
		} catch {
		}

		const edit = new vscode.WorkspaceEdit();
		if (document) {
			edit.replace(this.uri, document.validateRange(new vscode.Range(
				document.positionAt(0),
				document.positionAt(content.length)
			)), content);
		} else {
			edit.createFile(this.uri, { overwrite: true });
			edit.insert(this.uri, new vscode.Position(0, 0), content);
		}
		await vscode.workspace.applyEdit(edit);
	}

	override dispose() {
		this._onDidChangeCodeStackYml.dispose();
		this.disposables.forEach(d => d.dispose());
	}
}
