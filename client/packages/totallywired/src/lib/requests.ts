export type Res<T> = { ok: boolean; status: number; url: string; data?: T };

export const requestSearchParams = (request: Request) => {
  return new URL(request.url).searchParams;
};

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
  sendUrl: string,
  searchParams?: URLSearchParams,
  options: RequestInit = {},
): Promise<Res<T>> {
  const includeSearchParams = searchParams?.size ?? 0 > 0;
  const finalUrl = `${
    includeSearchParams ? `${sendUrl}?${searchParams}` : sendUrl
  }`;

  const res = await fetch(finalUrl, options);

  if (!res.ok) {
    return res;
  }

  const { ok, status, url } = res;
  const data = isJsonContent(res) ? await res.json() : await res.text();
  return { ok, status, url, data };
}

export async function sendCommand<T = never>(
  commandUrl: string,
  payload?: unknown,
  options: RequestInit = {},
): Promise<Res<T>> {
  const token = await getAntiforgeryToken();

  const res = await fetch(commandUrl, {
    ...options,
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
  });

  if (!res.ok) {
    return res;
  }

  const { ok, status, url } = res;
  const data = await res.json();
  return { ok, status, url, data };
}
