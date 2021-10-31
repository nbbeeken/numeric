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
