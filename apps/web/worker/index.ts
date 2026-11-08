// Cloudflare Pages advanced mode(_worker.js) 진입점.
// /api/* 는 apps/api의 실제 controller·service로 처리하고, 나머지는 정적 웹 파일을 돌려준다.
import { handleApi } from "./api";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DATABASE_URL: string;
}

interface Context {
  waitUntil(promise: Promise<unknown>): void;
}

export default {
  async fetch(request: Request, env: Env, context: Context): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleApi(request, env.DATABASE_URL, (promise) => context.waitUntil(promise));
    }
    return env.ASSETS.fetch(request);
  },
};
