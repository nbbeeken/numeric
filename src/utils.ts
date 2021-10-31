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
