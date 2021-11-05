import * as vscode from 'vscode';
import { makeMarkdown, parseNumber } from './parser';

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerHoverProvider('*', await createHoverProvider('javascript')));
}

export function deactivate() {}

const makeProvider = (fn: (word: string, line: string) => vscode.MarkdownString | undefined) => ({
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		const word = document.getText(document.getWordRangeAtPosition(position));
		const line = document.lineAt(position).text;

		const content = fn(word, line);

		if (content) {
			return new vscode.Hover(content);
		} else {
			return null;
		}
	},
});

async function createHoverProvider(language: string): Promise<vscode.HoverProvider> {
	return makeProvider((word: string) => {
		const n = parseNumber(word);
		const markdown = makeMarkdown(n);
		return new vscode.MarkdownString(markdown);
	});
}
