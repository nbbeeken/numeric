import * as vscode from 'vscode';
import { parseNumber } from './parser';
import { hexSequence, logBase } from './utils';

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerHoverProvider('javascript', await createHoverProvider('javascript'))
	);
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

		if (typeof n === 'number' && !Number.isInteger(n)) {
			const bytes = new Uint8Array(new Float64Array([n]).buffer);
			const leSeq = [...bytes].reverse();
			const bytesString = `
			LE: \`${hexSequence(leSeq.slice(0, 4))}_${hexSequence(leSeq.slice(5, 8))}\`

			BE: \`${hexSequence(bytes.slice(0, 4))}_${hexSequence(bytes.slice(5, 8))}\`
			`
				.split('\t')
				.join('');
			return new vscode.MarkdownString(bytesString);
		}

		const dec = n.toString(0xa);
		let hex = n.toString(0xf);
		hex = hex.padStart(Math.max(...[hex.length, 8, 16]), '0');

		let oct = n.toString(0x8);
		oct = oct.padStart(Math.max(...[oct.length, 3]), '0');

		let bin = n.toString(0x2);
		bin = bin.padStart(Math.max(...[bin.length, 32]), '0');

		const translations = [dec, `0x${hex}`, `0o${oct}`, `0b${bin}`];
		const string = '`' + translations.join('`\n\n`') + '`';

		return new vscode.MarkdownString(string);
	});
}
