import { DEMO_ACCOUNTS } from "../src/auth/demo-accounts.js";

const actorByRole = (role: string) => {
  const account = DEMO_ACCOUNTS.find((candidate) => candidate.role === role);
  if (account === undefined) {
    throw new Error(`데모 계정 없음: ${role}`);
  }
  return { actorId: account.id, actorName: account.displayName };
};

const hourOffset = (hours: number) => new Date(Date.now() - hours * 3_600_000);

export interface DemoAuditEvent {
  occurredAt: Date;
  actorId: string;
  actorRole: "PRODUCTION_PLANNER" | "MATERIAL_MANAGER" | "SHOP_FLOOR_OPERATOR" | "QUALITY_ENGINEER" | "SYSTEM_ADMIN";
  actorName: string;
  action:
    | "SESSION_LOGIN"
    | "SESSION_LOGOUT"
    | "WORK_ORDER_CREATED"
    | "WORK_ORDER_RELEASED"
    | "WORK_ORDER_CANCELLED"
    | "MATERIAL_RESERVED"
    | "MATERIAL_LOT_DISPOSITION_DECIDED"
    | "INSPECTION_VERDICTED";
  entityType: "WORK_ORDER" | "MATERIAL_LOT" | "INSPECTION" | "SESSION";
  entityId: string;
  summary: string;
  requestId: string;
}

export const DEMO_AUDIT_EVENTS: DemoAuditEvent[] = [
  {
    occurredAt: hourOffset(9),
    ...actorByRole("SHOP_FLOOR_OPERATOR"),
    actorRole: "SHOP_FLOOR_OPERATOR",
    action: "SESSION_LOGIN",
    entityType: "SESSION",
    entityId: "demo-shop-floor-operator",
    summary: "현장 작업자 데모 세션 로그인",
    requestId: "req-demo-0031",
  },
  {
    occurredAt: hourOffset(20),
    ...actorByRole("MATERIAL_MANAGER"),
    actorRole: "MATERIAL_MANAGER",
    action: "MATERIAL_LOT_DISPOSITION_DECIDED",
    entityType: "MATERIAL_LOT",
    entityId: "ML-2026-0323",
    summary: "방열 히트싱크 LOT 격리 처분 (QI-2026-0701)",
    requestId: "req-demo-0038",
  },
  {
    occurredAt: hourOffset(22),
    ...actorByRole("QUALITY_ENGINEER"),
    actorRole: "QUALITY_ENGINEER",
    action: "INSPECTION_VERDICTED",
    entityType: "INSPECTION",
    entityId: "INSP-2026-0107",
    summary: "기구 조립 검사 불합격 판정 (히트싱크 밀착 불량, 발열 시험 온도 초과)",
    requestId: "req-demo-0042",
  },
  {
    occurredAt: hourOffset(26),
    ...actorByRole("PRODUCTION_PLANNER"),
    actorRole: "PRODUCTION_PLANNER",
    action: "WORK_ORDER_RELEASED",
    entityType: "WORK_ORDER",
    entityId: "WO-2026-097",
    summary: "산업용 제어 보드 CB-410 100EA 작업지시 발행",
    requestId: "req-demo-0027",
  },
  {
    occurredAt: hourOffset(30),
    ...actorByRole("MATERIAL_MANAGER"),
    actorRole: "MATERIAL_MANAGER",
    action: "MATERIAL_RESERVED",
    entityType: "WORK_ORDER",
    entityId: "WO-2026-098",
    summary: "SMT 실장 공정 자재 요구에 MCU 칩 30EA 예약",
    requestId: "req-demo-0024",
  },
  {
    occurredAt: hourOffset(48),
    ...actorByRole("QUALITY_ENGINEER"),
    actorRole: "QUALITY_ENGINEER",
    action: "INSPECTION_VERDICTED",
    entityType: "INSPECTION",
    entityId: "INSP-2026-0104",
    summary: "SMT 실장 검사 판정 보류 (재측정 요청)",
    requestId: "req-demo-0019",
  },
  {
    occurredAt: hourOffset(50),
    ...actorByRole("PRODUCTION_PLANNER"),
    actorRole: "PRODUCTION_PLANNER",
    action: "WORK_ORDER_CANCELLED",
    entityType: "WORK_ORDER",
    entityId: "WO-2026-096",
    summary: "계획 변경으로 작업지시 취소 (실적 없음 확인)",
    requestId: "req-demo-0015",
  },
  {
    occurredAt: hourOffset(52),
    ...actorByRole("PRODUCTION_PLANNER"),
    actorRole: "PRODUCTION_PLANNER",
    action: "WORK_ORDER_CREATED",
    entityType: "WORK_ORDER",
    entityId: "WO-2026-099",
    summary: "소형 제어 보드 CB-210 250EA 초안 작업지시 생성",
    requestId: "req-demo-0012",
  },
  {
    occurredAt: hourOffset(55),
    ...actorByRole("SYSTEM_ADMIN"),
    actorRole: "SYSTEM_ADMIN",
    action: "SESSION_LOGIN",
    entityType: "SESSION",
    entityId: "demo-system-admin",
    summary: "시스템 관리자 데모 세션 로그인",
    requestId: "req-demo-0008",
  },
  {
    occurredAt: hourOffset(70),
    ...actorByRole("PRODUCTION_PLANNER"),
    actorRole: "PRODUCTION_PLANNER",
    action: "SESSION_LOGOUT",
    entityType: "SESSION",
    entityId: "demo-production-planner",
    summary: "생산계획 담당자 세션 종료",
    requestId: "req-demo-0003",
  },
];
