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
    code: "SEN-PROD-001",
    name: "다목적 환경 센서 모듈",
    baseUom: "EA",
  },
  {
    code: "SEN-PROD-002",
    name: "산업용 온습도 센서",
    baseUom: "EA",
  },
] as const;

export const DEMO_BOM_REVISIONS: DemoBomRevision[] = [
  {
    revisionNumber: "BOM-2026-R003",
    productCode: "SEN-PROD-001",
    productName: "다목적 환경 센서 모듈",
    productBaseUom: "EA",
    description: "TE 쿨링 모듈 사양 반영 발행본",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "SEN-MAT-014", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "SEN-MAT-032", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "SEN-MAT-045", quantityPerProductBaseUom: "4.000000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R004",
    productCode: "SEN-PROD-002",
    productName: "산업용 온습도 센서",
    productBaseUom: "EA",
    lifecycle: "PUBLISHED",
    items: [
      { materialCode: "SEN-MAT-014", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "SEN-MAT-021", quantityPerProductBaseUom: "2.500000" },
    ],
  },
  {
    revisionNumber: "BOM-2026-R005-DRAFT",
    productCode: "SEN-PROD-001",
    productName: "다목적 환경 센서 모듈",
    productBaseUom: "EA",
    description: "케이블 강화 초안",
    lifecycle: "DRAFT",
    items: [
      { materialCode: "SEN-MAT-014", quantityPerProductBaseUom: "2.000000" },
      { materialCode: "SEN-MAT-032", quantityPerProductBaseUom: "1.000000" },
      { materialCode: "SEN-MAT-045", quantityPerProductBaseUom: "4.000000" },
      { materialCode: "SEN-MAT-021", quantityPerProductBaseUom: "1.000000" },
    ],
  },
];
