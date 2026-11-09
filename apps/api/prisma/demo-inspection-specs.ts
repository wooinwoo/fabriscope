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
    productCode: "ECM-CTL-410",
    specName: "기구 조립 검사 규격 v2",
    gate: "ROUTE_ADVANCE",
    processStepName: "기구 조립 공정",
    description: "기구 조립 통과 기준 — 체결 토크·히트싱크 밀착",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R102",
    productCode: "ECM-CTL-410",
    specName: "제어 보드 최종검사 규격 v3",
    gate: "LOT_COMPLETE",
    description: "LOT 완료 기준 — 기능 시험·전압 안정성·발열 시험",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R103",
    productCode: "ECM-CTL-410",
    specName: "컨포멀 코팅 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "SMT 실장 공정",
    description: "코팅 누락·두께 기준 초안",
    lifecycle: "DRAFT",
  },
  {
    revisionNumber: "ISP-2026-R104",
    productCode: "ECM-CTL-410",
    specName: "AOI 검사 규격 v2",
    gate: "ROUTE_ADVANCE",
    processStepName: "SMT 실장 공정",
    description: "부품 누락·극성·납땜 브리지 기준",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R105",
    productCode: "ECM-CTL-410",
    specName: "SPI 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "솔더 페이스트 인쇄",
    description: "솔더 페이스트 도포 두께·면적 기준",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R201",
    productCode: "ECM-PWR-250",
    specName: "전원 모듈 SPI 검사 규격 v2",
    gate: "ROUTE_ADVANCE",
    processStepName: "솔더 페이스트 인쇄",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R202",
    productCode: "ECM-PWR-250",
    specName: "SMT 실장 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "SMT 실장 공정",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R203",
    productCode: "ECM-PWR-250",
    specName: "전원 모듈 최종검사 규격 v4",
    gate: "LOT_COMPLETE",
    description: "LOT 완료 기준 — 출력 전압·효율·발열 시험",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R204",
    productCode: "ECM-PWR-250",
    specName: "전원 모듈 기구 조립 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "기구 조립 공정",
    description: "히트싱크 체결·절연 거리 기준",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R205",
    productCode: "ECM-PWR-250",
    specName: "포장 상태 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "포장",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R301",
    productCode: "ECM-CTL-210",
    specName: "AOI 납땜 검사 규격 v1",
    gate: "ROUTE_ADVANCE",
    processStepName: "SMT 실장 공정",
    lifecycle: "PUBLISHED",
  },
  {
    revisionNumber: "ISP-2026-R302",
    productCode: "ECM-CTL-210",
    specName: "CB-210 최종검사 규격 v1",
    gate: "LOT_COMPLETE",
    lifecycle: "PUBLISHED",
  },
];
