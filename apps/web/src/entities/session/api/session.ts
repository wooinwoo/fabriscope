import { requestJson } from "@/shared/api";
import { parseSessionResponse, type Session } from "../model/session";

export async function fetchCurrentSession(signal?: AbortSignal) {
  const response = await requestJson<unknown>("/api/auth/me", {
    method: "GET",
    ...(signal === undefined ? {} : { signal }),
  });
  return parseSessionResponse(response);
}

/** 로그인 여부만 확인한다. 세션 쿠키가 없으면 null을 돌려준다. */
export async function fetchOptionalSession(): Promise<Session | null> {
  const response = await requestJson<{ session?: unknown }>("/api/auth/session", {
    method: "GET",
  });
  return response.session == null ? null : parseSessionResponse(response.session);
}
