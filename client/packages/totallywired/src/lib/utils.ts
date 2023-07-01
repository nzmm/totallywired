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
