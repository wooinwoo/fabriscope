const seoulStartOfToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return Date.parse(`${parts}T00:00:00+09:00`);
};

export { DEMO_PRODUCTS, type DemoProduct } from "../src/work-orders/work-order-products.js";

const dayOffset = (days: number, hour = 17) =>
  new Date(seoulStartOfToday() + days * 86_400_000 + hour * 3_600_000);

export interface DemoWorkOrder {
  orderNumber: string;
  productCode: string;
  productName: string;
  plannedQuantity: number;
  unit: string;
  dueDate: Date;
  status: "DRAFT" | "RELEASED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  progressPercent: number;
  currentStepName: string | null;
  blockedReason: string | null;
}

export const DEMO_WORK_ORDERS: DemoWorkOrder[] = [
  {
    orderNumber: "WO-2026-091",
    productCode: "ECM-CTL-640",
    productName: "산업용 제어 보드 CB-640",
    plannedQuantity: 120,
    unit: "EA",
    dueDate: dayOffset(2),
    status: "IN_PROGRESS",
    priority: "HIGH",
    progressPercent: 45,
    currentStepName: "조립 2공정",
    blockedReason: null,
  },
  {
    orderNumber: "WO-2026-092",
    productCode: "ECM-PWR-1280",
    productName: "전원 변환 모듈 PM-1280",
    plannedQuantity: 40,
    unit: "EA",
    dueDate: dayOffset(-1),
    status: "RELEASED",
    priority: "URGENT",
    progressPercent: 0,
    currentStepName: "라인 투입 대기",
    blockedReason: "자재 LOT 부족 (ECM-MAT-014)",
  },
  {
    orderNumber: "WO-2026-093",
    productCode: "ECM-CTL-320-QC",
    productName: "제어 보드 CB-320 QC 버전",
    plannedQuantity: 200,
    unit: "EA",
    dueDate: dayOffset(9),
    status: "DRAFT",
    priority: "NORMAL",
    progressPercent: 0,
    currentStepName: null,
    blockedReason: null,
  },
  {
    orderNumber: "WO-2026-094",
    productCode: "ECM-CTL-640",
    productName: "산업용 제어 보드 CB-640",
    plannedQuantity: 80,
    unit: "EA",
    dueDate: dayOffset(0, 12),
    status: "IN_PROGRESS",
    priority: "NORMAL",
    progressPercent: 70,
    currentStepName: "최종 검사 대기",
    blockedReason: null,
  },
  {
    orderNumber: "WO-2026-095",
    productCode: "ECM-PWR-1280",
    productName: "전원 변환 모듈 PM-1280",
    plannedQuantity: 60,
    unit: "EA",
    dueDate: dayOffset(-3),
    status: "COMPLETED",
    priority: "HIGH",
    progressPercent: 100,
    currentStepName: "출하 완료",
    blockedReason: null,
  },
  {
    orderNumber: "WO-2026-096",
    productCode: "ECM-CTL-320-QC",
    productName: "제어 보드 CB-320 QC 버전",
    plannedQuantity: 150,
    unit: "EA",
    dueDate: dayOffset(5),
    status: "CANCELLED",
    priority: "LOW",
    progressPercent: 0,
    currentStepName: null,
    blockedReason: null,
  },
  {
    orderNumber: "WO-2026-097",
    productCode: "ECM-CTL-640",
    productName: "산업용 제어 보드 CB-640",
    plannedQuantity: 100,
    unit: "EA",
    dueDate: dayOffset(6),
    status: "RELEASED",
    priority: "HIGH",
    progressPercent: 10,
    currentStepName: "라인 투입 대기",
    blockedReason: null,
  },
  {
    orderNumber: "WO-2026-098",
    productCode: "ECM-PWR-1280",
    productName: "전원 변환 모듈 PM-1280",
    plannedQuantity: 30,
    unit: "EA",
    dueDate: dayOffset(1),
    status: "IN_PROGRESS",
    priority: "NORMAL",
    progressPercent: 30,
    currentStepName: "SMT 실장 공정",
    blockedReason: "선행 검사 판정 보류",
  },
  {
    orderNumber: "WO-2026-099",
    productCode: "ECM-CTL-320-QC",
    productName: "제어 보드 CB-320 QC 버전",
    plannedQuantity: 250,
    unit: "EA",
    dueDate: dayOffset(4),
    status: "DRAFT",
    priority: "URGENT",
    progressPercent: 0,
    currentStepName: null,
    blockedReason: null,
  },
];
