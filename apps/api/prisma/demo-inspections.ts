export interface DemoInspection {
  inspectionNumber: string;
  workOrderNumber: string;
  productionLotNumber: string;
  processStepName: string;
  gate: "ROUTE_ADVANCE" | "LOT_COMPLETE";
  specName: string;
  executionStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  verdict: "PASS" | "FAIL" | "HOLD" | null;
  completedAt: Date | null;
}

const dayOffset = (days: number) => new Date(Date.now() + days * 86_400_000);

export const DEMO_INSPECTIONS: DemoInspection[] = [
  {
    inspectionNumber: "INSP-2026-0101",
    workOrderNumber: "WO-2026-091",
    productionLotNumber: "PL-2026-091A",
    processStepName: "최종 검사",
    gate: "LOT_COMPLETE",
    specName: "제어 보드 최종검사 규격 v3",
    executionStatus: "PENDING",
    verdict: null,
    completedAt: null,
  },
  {
    inspectionNumber: "INSP-2026-0102",
    workOrderNumber: "WO-2026-094",
    productionLotNumber: "PL-2026-094A",
    processStepName: "최종 검사",
    gate: "LOT_COMPLETE",
    specName: "제어 보드 최종검사 규격 v3",
    executionStatus: "PENDING",
    verdict: null,
    completedAt: null,
  },
  {
    inspectionNumber: "INSP-2026-0103",
    workOrderNumber: "WO-2026-091",
    productionLotNumber: "PL-2026-091A",
    processStepName: "SMT 실장 공정",
    gate: "ROUTE_ADVANCE",
    specName: "AOI 검사 규격 v2",
    executionStatus: "COMPLETED",
    verdict: "PASS",
    completedAt: dayOffset(-4),
  },
  {
    inspectionNumber: "INSP-2026-0104",
    workOrderNumber: "WO-2026-098",
    productionLotNumber: "PL-2026-098A",
    processStepName: "SMT 실장 공정",
    gate: "ROUTE_ADVANCE",
    specName: "SMT 실장 검사 규격 v1",
    executionStatus: "COMPLETED",
    verdict: "HOLD",
    completedAt: dayOffset(-2),
  },
  {
    inspectionNumber: "INSP-2026-0105",
    workOrderNumber: "WO-2026-095",
    productionLotNumber: "PL-2026-095A",
    processStepName: "최종 검사",
    gate: "LOT_COMPLETE",
    specName: "전원 모듈 최종검사 규격 v4",
    executionStatus: "COMPLETED",
    verdict: "PASS",
    completedAt: dayOffset(-3),
  },
  {
    inspectionNumber: "INSP-2026-0106",
    workOrderNumber: "WO-2026-092",
    productionLotNumber: "PL-2026-092A",
    processStepName: "솔더 페이스트 인쇄",
    gate: "ROUTE_ADVANCE",
    specName: "전원 모듈 SPI 검사 규격 v2",
    executionStatus: "PENDING",
    verdict: null,
    completedAt: null,
  },
  {
    inspectionNumber: "INSP-2026-0107",
    workOrderNumber: "WO-2026-094",
    productionLotNumber: "PL-2026-094A",
    processStepName: "기구 조립 공정",
    gate: "ROUTE_ADVANCE",
    specName: "기구 조립 검사 규격 v2",
    executionStatus: "COMPLETED",
    verdict: "FAIL",
    completedAt: dayOffset(-22 / 24),
  },
  {
    inspectionNumber: "INSP-2026-0108",
    workOrderNumber: "WO-2026-095",
    productionLotNumber: "PL-2026-095A",
    processStepName: "포장",
    gate: "ROUTE_ADVANCE",
    specName: "포장 상태 검사 규격 v1",
    executionStatus: "COMPLETED",
    verdict: "PASS",
    completedAt: dayOffset(-2.5),
  },
  {
    inspectionNumber: "INSP-2026-0109",
    workOrderNumber: "WO-2026-097",
    productionLotNumber: "PL-2026-097A",
    processStepName: "솔더 페이스트 인쇄",
    gate: "ROUTE_ADVANCE",
    specName: "SPI 검사 규격 v1",
    executionStatus: "CANCELLED",
    verdict: null,
    completedAt: null,
  },
  {
    inspectionNumber: "INSP-2026-0110",
    workOrderNumber: "WO-2026-098",
    productionLotNumber: "PL-2026-098A",
    processStepName: "기구 조립 공정",
    gate: "ROUTE_ADVANCE",
    specName: "전원 모듈 기구 조립 검사 규격 v1",
    executionStatus: "PENDING",
    verdict: null,
    completedAt: null,
  },
];
