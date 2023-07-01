function extractAntiforgeryToken(res: Response) {
  return res.ok
    ? document?.cookie
        ?.split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] ?? ""
    : "";
}

async function getAntiforgeryToken() {
  const res = await fetch("/antiforgery/token");
  return extractAntiforgeryToken(res);
}

function isJsonContent(res: Response) {
  return (
    (res.headers.get("content-type")?.indexOf("application/json") ?? -1) !== -1
  );
}

export async function sendQuery<T>(
  url: string,
  searchParams?: URLSearchParams
): Promise<T> {
  const res = await fetch(`${searchParams ? `${url}?${searchParams}` : url}`);
  return isJsonContent(res) ? await res.json() : await res.text();
}

export async function sendCommand<T = never>(
  url: string,
  data?: any
): Promise<T> {
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
}
