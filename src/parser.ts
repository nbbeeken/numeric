function determineRadix(text: string) {
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

	const isBigInt = text.endsWith('n');
	if (isBigInt) {
		text = text.slice(0, text.length - 1);
	}

	const isFloat = text.includes('.');
	const isScientific = text.includes('e') || text.includes('E');

	const radix = !isFloat && !isScientific ? determineRadix(text) : 10;

	if (isFloat && isScientific) {
		return Number.parseFloat(text);
	} else if (isBigInt) {
		return BigInt(text);
	} else {
		return Number.parseInt(text, radix);
	}
}
