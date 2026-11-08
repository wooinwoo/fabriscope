// Cloudflare Pages advanced mode(_worker.js) 진입점.
// /api/* 는 apps/api의 실제 controller·service로 처리하고, 나머지는 정적 웹 파일을 돌려준다.
import { handleApi } from "./api";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DATABASE_URL: string;
  /** 대표 주소. 로그인 Origin 검사와 같은 값이며, 기본 pages.dev 주소는 여기로 보낸다. */
  WEB_ORIGIN?: string;
}

interface Context {
  waitUntil(promise: Promise<unknown>): void;
}

// 미리보기 배포(<hash>.fabriscope.pages.dev)는 그대로 두고, 운영 기본 주소만 대표 주소로 보낸다.
const legacyHost = "fabriscope.pages.dev";

export default {
  async fetch(request: Request, env: Env, context: Context): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === legacyHost && env.WEB_ORIGIN && new URL(env.WEB_ORIGIN).hostname !== legacyHost) {
      return Response.redirect(`${env.WEB_ORIGIN}${url.pathname}${url.search}`, 301);
    }
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleApi(request, env.DATABASE_URL, (promise) => context.waitUntil(promise));
    }
    return env.ASSETS.fetch(request);
  },
};
