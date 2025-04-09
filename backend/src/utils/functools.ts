/**
 * Finds the maximum element of the iterable according to the order of the specified key.
 * @param items iterable
 * @param key lambda yielding comparable types
 * @returns the maximum element; `undefined` if `items` is empty.
 */
export const max = <T, K extends number | string | Date>(items: Iterable<T>, key: (item: T) => K): T | undefined => {
	let result: T | undefined;
	let maxKey: K | undefined;

	for (const item of items) {
		const itemKey = key(item);
		if (maxKey === undefined || itemKey > maxKey) {
			maxKey = itemKey;
			result = item;
		}
	}

	return result;
};
