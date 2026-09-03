export const WORK_ORDER_STATUS_LABELS = {
  DRAFT: "초안",
  RELEASED: "발행",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
  CANCELLED: "취소",
} as const;

export type WorkOrderStatus = keyof typeof WORK_ORDER_STATUS_LABELS;

export const WORK_ORDER_STATUSES = Object.keys(
  WORK_ORDER_STATUS_LABELS,
) as readonly WorkOrderStatus[];

export type WorkOrderPriorityBadgeValue =
  "low" | "normal" | "high" | "critical";

const PRIORITY_BADGE_VALUES = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "critical",
} as const;

export type WorkOrderPriority = keyof typeof PRIORITY_BADGE_VALUES;

export const WORK_ORDER_PRIORITIES = Object.keys(
  PRIORITY_BADGE_VALUES,
) as readonly WorkOrderPriority[];

export const WORK_ORDER_PRIORITY_LABELS = {
  LOW: "낮음",
  NORMAL: "보통",
  HIGH: "높음",
  URGENT: "긴급",
} as const;

export const WORK_ORDER_DUE_OPTIONS = {
  all: "전체 납기",
  overdue: "납기 지연",
  today: "오늘 만료",
  "7d": "7일 이내",
} as const;

export type WorkOrderDueFilter = keyof typeof WORK_ORDER_DUE_OPTIONS;

export interface WorkOrderListItem {
  id: string;
  orderNumber: string;
  productCode: string;
  productName: string;
  plannedQuantity: number;
  unit: string;
  dueDate: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  progressPercent: number;
  currentStepName: string | null;
  blockedReason: string | null;
}

export interface WorkOrderListResult {
  items: WorkOrderListItem[];
  page: number;
  pageSize: number;
  total: number;
}

export function toPriorityBadgeValue(
  priority: WorkOrderPriority,
): WorkOrderPriorityBadgeValue {
  return PRIORITY_BADGE_VALUES[priority];
}

export function formatWorkOrderDueDate(isoDate: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoDate));
}

export function isDueOverdue(isoDate: string, now = new Date()): boolean {
  const startOfToday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return new Date(isoDate).getTime() < Date.parse(`${startOfToday}T00:00:00+09:00`);
}
