export const MATH_PLUS_PLUS = {
	abs(n: number | bigint) {
		if (typeof n === 'number') {
			return Math.abs(n);
		}
		return n < 0n ? -n : n;
	},
	absInt(n: number | bigint): bigint {
		if (typeof n === 'number') {
			return BigInt(Math.abs(n));
		}
		return BigInt(n < 0n ? -n : n);
	},
	sign(n: number | bigint): 1 | 0 | -1 {
		if (typeof n === 'number') {
			return Math.sign(n) === -1 ? -1 : Math.sign(n) === 0 ? 0 : 1;
		}
		return n === 0n ? 0 : n > 0n ? 1 : -1;
	},
};
