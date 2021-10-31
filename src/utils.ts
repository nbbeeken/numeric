export function hexSequence(seq: ArrayLike<number | bigint>): string {
	const array = Array.from(seq);
	const strings = array.map((n) => n.toString(16).padStart(2, '0'));
	return strings.join('');
}

export function tryFn<F extends (...args: any) => any>(
	fn: F,
	...args: Parameters<F>
): { result?: ReturnType<F>; error?: Error } {
	let result = undefined;
	let error = undefined;
	try {
		result = fn(...(args as any[]));
	} catch (thrownError: unknown) {
		error = thrownError instanceof Error ? thrownError : new Error(String(thrownError));
	}
	return { result, error };
}

export function logBase(n: number, base: number) {
	return Math.log(n) / Math.log(base);
}
