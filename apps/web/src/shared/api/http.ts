export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

// 같은 화면을 다시 열 때 서버 왕복을 기다리지 않도록 GET 응답을 잠깐 기억한다.
// 데이터를 바꾸는 요청(POST·PATCH·DELETE 등)이 끝나면 전부 버리고, 실패한 응답은 기억하지 않는다.
const GET_CACHE_MS = 60_000;
const getCache = new Map<string, { at: number; value: Promise<unknown> }>();

export function clearRequestCache() {
  getCache.clear();
}

export async function requestJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  if (method !== "GET") {
    try {
      return await sendJson<T>(path, init);
    } finally {
      clearRequestCache();
    }
  }
  // 공용 요청은 화면의 취소 신호와 묶지 않고 끝까지 받아 기억한다. 화면은 자기 신호로만 기다리기를 그만둔다.
  const { signal, ...shared } = init;
  let hit = getCache.get(path);
  if (!hit || Date.now() - hit.at >= GET_CACHE_MS) {
    const value = sendJson<unknown>(path, shared);
    hit = { at: Date.now(), value };
    getCache.set(path, hit);
    value.catch(() => {
      if (getCache.get(path)?.value === value) getCache.delete(path);
    });
  }
  return withSignal(hit.value as Promise<T>, signal ?? undefined);
}

function withSignal<T>(promise: Promise<T>, signal: AbortSignal | undefined): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => { signal.removeEventListener("abort", onAbort); resolve(value); },
      (error: unknown) => { signal.removeEventListener("abort", onAbort); reject(error); },
    );
  });
}

async function sendJson<T>(path: string, init: RequestInit): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers,
  });
  const body = await readResponseBody(response);

  if (!response.ok) {
    const error = asErrorBody(body);
    throw new ApiRequestError(
      response.status,
      error?.code ?? "API_REQUEST_FAILED",
      error?.message ?? `요청을 처리하지 못했습니다. (${response.status})`,
    );
  }

  return body as T;
}

async function readResponseBody(response: Response) {
  if (response.status === 204) {
    return undefined;
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    return undefined;
  }
}

function asErrorBody(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const candidate = body as Record<string, unknown>;
  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message:
      typeof candidate.message === "string" ? candidate.message : undefined,
  };
}
