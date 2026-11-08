export interface DemoBomItem {
  materialCode: string;
  quantityPerProductBaseUom: string;
}

export interface DemoBomRevision {
  revisionNumber: string;
  productCode: string;
  productName: string;
  productBaseUom: string;
  description?: string;
  lifecycle: "DRAFT" | "PUBLISHED" | "INACTIVE";
  items: DemoBomItem[];
}

export const DEMO_PRODUCTS = [
  {
    code: "ECM-CTL-640",
    name: "산업용 제어 보드 CB-640",
    baseUom: "EA",
  },
  {
    code: "ECM-PWR-1280",
    name: "전원 변환 모듈 PM-1280",
    baseUom: "EA",
  },
  {
    code: "ECM-CTL-320-QC",
    name: "제어 보드 CB-320 QC 버전",
    baseUom: "EA",
  },
] as const;

export const DEMO_BOM_REVISIONS: DemoBomRevision[] = [
  {
    revisionNumber: "BOM-2026-R001",
    productCode: "ECM-CTL-640",
    productName: "산업용 제어 보드 CB-640",
    productBaseUom: "EA",
    description: "방열 히트싱크 사양 반영 발행본",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "ECM-MAT-032", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-045", quantityPerProductBaseUom: "4.000000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R002",
    productCode: "ECM-PWR-1280",
    productName: "전원 변환 모듈 PM-1280",
    productBaseUom: "EA",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-021", quantityPerProductBaseUom: "2.500000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R003-DRAFT",
    productCode: "ECM-CTL-640",
    productName: "산업용 제어 보드 CB-640",
    productBaseUom: "EA",
    description: "케이블 강화 초안",
    lifecycle: "DRAFT",
    items: [
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "ECM-MAT-032", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-045", quantityPerProductBaseUom: "4.000000" },
      { materialCode: "ECM-MAT-021", quantityPerProductBaseUom: "1.000000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R004",
    productCode: "ECM-CTL-320-QC",
    productName: "제어 보드 CB-320 QC 버전",
    productBaseUom: "EA",
    description: "QC 버전 전용 구성 — 소수 소요량 포함",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "1.500000" },
      { materialCode: "ECM-MAT-032", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "ECM-MAT-045", quantityPerProductBaseUom: "1.000000" },
    ],
  },
];
