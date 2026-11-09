import { describe, expect, it } from "vitest";
import type { Session } from "@/entities/session";
import { resolveShellContext } from "./shell-config";

const session: Session = {
  user: { id: "u1", email: "planner@example.com", displayName: "생산계획 담당자" },
  activeRole: { code: "PRODUCTION_PLANNER", label: "생산계획 담당자" },
  permissions: [],
  landingRoute: "/work-orders",
  expiresAt: "2099-01-01T00:00:00.000Z",
  csrfToken: "test",
};

const titleOf = (pathname: string) => resolveShellContext(pathname, session).pageTitle;

describe("resolveShellContext page title", () => {
  it("상세·생성 화면은 목록 제목을 이어 받는다", () => {
    expect(titleOf("/work-orders")).toBe("작업지시");
    expect(titleOf("/work-orders/wo-1")).toBe("작업지시 상세");
    expect(titleOf("/work-orders/new")).toBe("작업지시 생성");
    expect(titleOf("/quality/inspections/insp-1")).toBe("품질 검사 상세");
    expect(titleOf("/nowhere")).toBe("화면을 찾을 수 없음");
  });
});
