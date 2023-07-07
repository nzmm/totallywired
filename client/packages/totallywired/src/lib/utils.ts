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
 * Shuffles the supplied array in-place
 */
export const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const debounce = (func: (...args: any[]) => void, timeout = 300) => {
  let timer: number;
  return (...args: any[]) => {
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
  return h >=1 
    ? `${h}h ${m}m ${s}s`
    : `${m}m ${s}s`;
}
