type ListItem<T> = T & { height: number };

/**
 * Creates dummy data
 */
export function createItems<T>(
  n: number,
  ctor: (i: number) => ListItem<T>
): ListItem<T>[] {
  n = isNaN(n) ? 20 : n;
  n = Math.max(0, Math.min(n, 100_000));
  return Array(n)
    .fill(null)
    .map((_, i) => ctor(i));
}
