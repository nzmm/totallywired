export type Res<T> = { ok: boolean; status: number; data?: T };

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
  url: string,
  searchParams?: URLSearchParams
): Promise<Res<T>> {
  const includeSearchParams = searchParams?.size ?? 0 > 0;
  const res = await fetch(
    `${includeSearchParams ? `${url}?${searchParams}` : url}`
  );
  const { ok, status } = res;

  if (!ok) {
    return { ok, status };
  }

  const data = isJsonContent(res) ? await res.json() : await res.text();
  return { ok, status, data };
}

export async function sendCommand<T = never>(
  url: string,
  payload?: any
): Promise<Res<T>> {
  const token = await getAntiforgeryToken();

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
  });

  const { ok, status } = res;
  const data = await res.json();
  return { ok, status, data };
}
