export const getValidSearchParams = (searchParams?: URLSearchParams) => {
  if (!searchParams) {
    return;
  }

  const params = new URLSearchParams();
  for (const [k, v] of searchParams) {
    if (k === "q" && v.length < 3) {
      continue;
    }

    params.append(k, v);
  }
  return params;
};

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
