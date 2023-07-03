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
 * Shuffles the supplied array in place
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
