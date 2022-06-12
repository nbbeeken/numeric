import * as vscode from 'vscode';

export class Logger {
	_outputChannel;

	get name() {
		return 'Numeric';
	}

	constructor() {
		this._outputChannel = vscode.window.createOutputChannel(this.name);
	}

	log(msg: string, ...args: any[]) {
		this._outputChannel.appendLine(`[LOG ${new Date()}] ${msg} ${args.join(' ')}`);
	}
}
