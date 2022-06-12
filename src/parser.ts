import { logger } from './extension';
import { MATH_PLUS_PLUS } from './math';
import { hexSequence } from './utils';

export const NUMERIC_RX = {
	hex: /[-+]?0x[0-9a-f][0-9a-f_]+/i,
	oct: /[-+]?0o[0-7][0-7_]+/,
	bin: /[-+]?0b[01][01_]+/,
	dec: /[-+]?[0-9][0-9_]+/,
	flo: /[-+]?([0-9]*\.?[0-9]+(e[-+]?[0-9]+)?)/i,
} as const;

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
	logger.log('parsing', JSON.stringify(text));

	if (text.length === 0) {
		return 0;
	}

	if (text === 'NaN') {
		return NaN;
	}

	text = text.toLowerCase();
	text = text.split('_').join(''); // delete separators

	const isNegative = text.startsWith('-');
	if (isNegative) {
		text = text.slice(1);
	}

	const radix = determineRadix(text);

	const isBigInt = text.endsWith('n');
	if (isBigInt) {
		text = text.slice(0, text.length - 1);
		return isNegative ? -BigInt(text) : BigInt(text);
	}

	if (radix === 16 || radix === 8 || radix === 2) {
		text = text.slice(2);
	} else {
		const isFloat = text.includes('.');
		const isScientific = text.includes('e') || text.includes('E');
		if (isFloat || isScientific) {
			return isNegative ? -Number.parseFloat(text) : Number.parseFloat(text);
		}
	}

	const n = isNegative ? -Number.parseInt(text, radix) : Number.parseInt(text, radix);
	if (!Number.isInteger(n)) {
		throw new Error(`You cannot have a non-int, got ${n}`);
	}
	return n;
}

export function makeMarkdown(n: number | bigint): string {
	if (typeof n === 'number') {
		if (!Number.isInteger(n) || Object.is(n, -0)) {
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
	}

	const isNegative = MATH_PLUS_PLUS.sign(n) === -1;
	const bigIntValue = BigInt(n);
	const bytes = new Uint8Array(new (isNegative ? BigInt64Array : BigUint64Array)([bigIntValue]).buffer);
	const leSeq = Array.from(bytes).reverse();

	const dec = n.toLocaleString();
	const hex = Array.from(leSeq, (byte) => byte.toString(16).padStart(2, '0')).join('');

	const bin32Or64 =
		leSeq.slice(0, 4).every((b) => b === 255) || leSeq.slice(0, 4).every((b) => b === 0) ? leSeq.slice(4) : leSeq;
	const bin = Array.from(bin32Or64, (byte) => byte.toString(2).padStart(8, '0')).join('');

	let binString;
	if (bin32Or64.length === 8) {
		binString = [
			`- 64-bits:`,
			`\t- hi:\`0b${bin.slice(0, 16)}_${bin.slice(16, 32)}\``,
			`\t- lo:\`0b${bin.slice(32, 48)}_${bin.slice(48, 64)}\``,
		].join('\n');
	} else {
		binString = `- \`0b${bin.slice(0, 16)}_${bin.slice(16, 32)}\``;
	}

	const translations = [`- \`${dec}\``, `- \`0x${hex}\``, binString];

	const absValue = MATH_PLUS_PLUS.absInt(n);
	if (absValue <= 0o777n) {
		translations.push(`- \`${isNegative ? '-' : ''}0o${absValue.toString(8).padStart(3, '0')}\``);
	}
	const string = translations.join('\n');

	return string;
}
