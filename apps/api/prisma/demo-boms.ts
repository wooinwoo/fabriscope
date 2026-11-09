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
    code: "ECM-CTL-410",
    name: "산업용 제어 보드 CB-410",
    baseUom: "EA",
  },
  {
    code: "ECM-PWR-250",
    name: "전원 변환 모듈 PM-250",
    baseUom: "EA",
  },
  {
    code: "ECM-CTL-210",
    name: "소형 제어 보드 CB-210",
    baseUom: "EA",
  },
] as const;

export const DEMO_BOM_REVISIONS: DemoBomRevision[] = [
  {
    revisionNumber: "BOM-2026-R001",
    productCode: "ECM-CTL-410",
    productName: "산업용 제어 보드 CB-410",
    productBaseUom: "EA",
    description: "이중 MCU와 전원부 히트싱크를 쓰는 발행본",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "ECM-MAT-021", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "ECM-MAT-032", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-045", quantityPerProductBaseUom: "4.000000" },
      { materialCode: "ECM-MAT-051", quantityPerProductBaseUom: "3.500000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R002",
    productCode: "ECM-PWR-250",
    productName: "전원 변환 모듈 PM-250",
    productBaseUom: "EA",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "ECM-MAT-021", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-032", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-045", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "ECM-MAT-051", quantityPerProductBaseUom: "4.500000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R003-DRAFT",
    productCode: "ECM-CTL-410",
    productName: "산업용 제어 보드 CB-410",
    productBaseUom: "EA",
    description: "외부 I/O 커넥터를 2개 늘리는 초안",
    lifecycle: "DRAFT",
    items: [
      { materialCode: "ECM-MAT-021", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "ECM-MAT-032", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-045", quantityPerProductBaseUom: "6.000000" },
      { materialCode: "ECM-MAT-051", quantityPerProductBaseUom: "3.500000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R004",
    productCode: "ECM-CTL-210",
    productName: "소형 제어 보드 CB-210",
    productBaseUom: "EA",
    description: "방열판 없는 소형 보드 — 솔더 페이스트는 g 단위 소요량",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "ECM-MAT-021", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-014", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "ECM-MAT-045", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "ECM-MAT-051", quantityPerProductBaseUom: "2.500000" },
    ],
  },
];
