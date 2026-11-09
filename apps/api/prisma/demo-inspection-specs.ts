export interface DemoInspectionSpecRevision {
  revisionNumber: string;
  productCode: string;
  specName: string;
  gate: "ROUTE_ADVANCE" | "LOT_COMPLETE";
  processStepName?: string;
  description?: string;
  lifecycle: "DRAFT" | "PUBLISHED" | "INACTIVE";
}

export const DEMO_INSPECTION_SPEC_REVISIONS: DemoInspectionSpecRevision[] = [
  {
    revisionNumber: "ISP-2026-R101",
    productCode: "ECM-CTL-640",
    specName: "조립 정밀도 검사 규격 v2",
    gate: "ROUTE_ADVANCE",
    processStepName: "조립 2공정",
    description: "조립 2공정 통과 기준 — 정밀도 ±0.05mm",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R102",
    productCode: "ECM-CTL-640",
    specName: "제어 보드 최종검사 규격 v3",
    gate: "LOT_COMPLETE",
    description: "LOT 완료 기준 — 기능 시험·전압 안정성",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R103",
    productCode: "ECM-CTL-640",
    specName: "방수 등급 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "조립 2공정",
    description: "IP67 방수 등급 초안",
    lifecycle: "DRAFT",
  },
  {
    revisionNumber: "ISP-2026-R201",
    productCode: "ECM-PWR-1280",
    specName: "절단 치수 검사 규격 v2",
    gate: "ROUTE_ADVANCE",
    processStepName: "절단 1공정",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R202",
    productCode: "ECM-PWR-1280",
    specName: "SMT 실장 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "SMT 실장 공정",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R203",
    productCode: "ECM-PWR-1280",
    specName: "전원 모듈 최종검사 규격 v4",
    gate: "LOT_COMPLETE",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R301",
    productCode: "ECM-CTL-320-QC",
    specName: "제어 보드 납땜 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "납땜 공정",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R302",
    productCode: "ECM-CTL-320-QC",
    specName: "CB-320 최종검사 규격 v1",
    gate: "LOT_COMPLETE",
    lifecycle: "PUBLISHED",
  },
];
