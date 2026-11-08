// Cloudflare Pages Function: 같은 출처의 /api/* 요청을 API 서버로 그대로 넘긴다.
// 브라우저 입장에서는 웹과 API가 한 주소라서 HttpOnly 세션 cookie와 Origin 검사가 그대로 동작한다.
// API 서버 주소는 Pages 환경변수 API_ORIGIN(예: https://fabriscope-api.onrender.com)으로 받는다.
export async function onRequest({ request, env }) {
  if (!env.API_ORIGIN) {
    return Response.json(
      { code: "API_NOT_CONFIGURED", message: "API 서버 주소가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const incoming = new URL(request.url);
  const target = new URL(`${incoming.pathname}${incoming.search}`, env.API_ORIGIN);
  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));

  return fetch(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });
}
