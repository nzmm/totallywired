const extractAntiforgeryToken = (res: Response) =>
  res.ok
    ? document?.cookie
        ?.split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] ?? ""
    : "";

export const getAntiforgeryToken = () =>
  fetch("/antiforgery/token").then(extractAntiforgeryToken);

export const sendQuery = async <T>(
  url: string,
  queryParams?: URLSearchParams
): Promise<T> => {
  const res = await fetch(`${queryParams ? `${url}?${queryParams}` : url}`);
  return await res.json();
};

export const sendCommand = async <T = never>(
  url: string,
  data?: any
): Promise<T> => {
  const token = await getAntiforgeryToken();
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
  });
  return await res.json();
};
