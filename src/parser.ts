import { hexSequence } from './utils';

export function determineRadix(text: string) {
	if (text.startsWith('0x')) {
		return 16;
	} else if (text.startsWith('0o')) {
		return 8;
	} else if (text.startsWith('0b')) {
		return 2;
	} else {
		return 10;
	}
}

export function parseNumber(text: string): number | bigint {
	if (text.length === 0) {
		return 0;
	}

	text = text.toLowerCase();
	text = text.split('_').join(''); // delete separators

	const radix = determineRadix(text);

	const isBigInt = text.endsWith('n');
	if (isBigInt) {
		text = text.slice(0, text.length - 1);
	}

	if (radix === 16 || radix === 8 || radix === 2) {
		text = text.slice(2);
	} else {
		const isFloat = text.includes('.');
		const isScientific = text.includes('e') || text.includes('E');
		if (isFloat || isScientific) {
			return Number.parseFloat(text);
		}
	}

	if (isBigInt) {
		return BigInt(text);
	} else {
		return Number.parseInt(text, radix);
	}
}

export function makeMarkdown(n: number | bigint): string {
	if (typeof n === 'number' && !Number.isInteger(n)) {
		const bytes = new Uint8Array(new Float64Array([n]).buffer);
		const leSeq = [...bytes].reverse();
		const bytesString = `
		LE: \`${hexSequence(leSeq.slice(0, 4))}_${hexSequence(leSeq.slice(5, 8))}\`

		BE: \`${hexSequence(bytes.slice(0, 4))}_${hexSequence(bytes.slice(5, 8))}\`
		`
			.split('\t')
			.join('');
		return bytesString;
	}

	const dec = n.toLocaleString();

	let hex = n.toString(0x10);
	hex = hex.padStart(Math.max(...[hex.length, 8, 16]), '0');

	let oct = n.toString(0x8);
	oct = oct.padStart(Math.max(...[oct.length, 3]), '0');

	let bin = n.toString(0x2);
	bin = bin.padStart(Math.max(...[bin.length, 32]), '0');

	const translations = [dec, `0x${hex}`, `0o${oct}`, `0b${bin}`];
	const string = '`' + translations.join('`\n\n`') + '`';

	return string;
}
