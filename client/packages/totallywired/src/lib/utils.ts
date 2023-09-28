/**
 * Creates a shuffled array from the source array.
 * If a `limit` value is supplied, the the result array length will not exceed the `limit` value.
 */
export const shuffle = <T>(source: T[], limit?: number) => {
  limit = Math.min(source.length, limit ?? source.length);

  const indices = Array.from({ length: source.length }, (_, i) => i);
  const result: T[] = [];

  while (result.length < limit) {
    const seed = Math.round(Math.random() * indices.length);
    const [randomIndex] = indices.splice(seed, 1);
    result.push(source[randomIndex]);
  }

  return result;
};

export const debounce = <
  T extends { apply: (obj: unknown, args: unknown[]) => void },
>(
  func: T,
  timeout = 300,
) => {
  let timer: number;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const duration = (ms: number) => {
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return h >= 1 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
};

/**
 * Zero pads the start of the number ensuring its at least two characters in length.
 *
 * Example: `5` ➝ `'05'`
 */
const pad0 = (n: number) => n.toString().padStart(2, "0");

export const displayLength = (ms: number) => {
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return h >= 1 ? `${h}:${pad0(m)}:${pad0(s)}` : `${m}:${pad0(s)}`;
};

/**
 * Attmempts to parse a date time string.
 * @returns A Date object or null if parsing fails
 */
export const tryParseDate = (dateStr: string): Date | null => {
  try {
    return new Date(dateStr);
  } catch {
    return null;
  }
};

/**
 * Normalises a date string to just the full year.
 * @returns A year number or null if parsing fails
 */
export const getYear = (dateStr: string | undefined): number | null => {
  if (dateStr) {
    return tryParseDate(dateStr)?.getFullYear() ?? null;
  }
  return null;
};
