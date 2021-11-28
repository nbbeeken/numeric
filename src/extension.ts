import * as vscode from 'vscode';
import { Logger } from './logger';
import { makeMarkdown, NUMERIC_RX, parseNumber } from './parser';
import { tryFn } from './utils';

const DEBUG_MODE = true;
let logger: Logger;

export async function activate(context: vscode.ExtensionContext) {
	logger = new Logger();
	logger.log('activate numeric');
	context.subscriptions.push(vscode.languages.registerHoverProvider('*', await createHoverProvider()));
}

export function deactivate() {}

const makeProvider = (
	fn: (document: vscode.TextDocument, position: vscode.Position) => vscode.MarkdownString | undefined
) => ({
	provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		const { result, error } = tryFn(fn, document, position);
		if (error || result == null) {
			logger.log(`${error}`);
			return null;
		}
		return new vscode.Hover(result);
	},
});

async function createHoverProvider(): Promise<vscode.HoverProvider> {
	return makeProvider((document: vscode.TextDocument, position: vscode.Position) => {
		const word = document.getText(document.getWordRangeAtPosition(position, /\S+/));

		logger.log('word', word);

		const regexps = Object.entries(NUMERIC_RX);

		let bestMatch = undefined;
		let matchedText;
		for (const [name, regex] of regexps) {
			const wordRange = document.getWordRangeAtPosition(position, regex);
			matchedText = document.getText(wordRange);
			if (matchedText.length <= word.length + 3 && matchedText.length >= word.length - 3) {
				bestMatch = name;
				break;
			}
		}

		logger.log('matchedText', matchedText);
		logger.log('bestMatch', bestMatch);

		if (typeof matchedText !== 'string') {
			throw new Error('Must match something!!!');
		}

		const line = document.lineAt(position).text;

		const { result, error } = tryFn(parseNumber, matchedText);
		if (error || typeof result === 'undefined') {
			logger.log(`err ${error}`);
			return new vscode.MarkdownString(`issue parsing - ${error}`);
		}
		let markdown = makeMarkdown(result);
		if (DEBUG_MODE) {
			markdown += `\n\n input ${word}`;
		}
		return new vscode.MarkdownString(markdown);
	});
}
