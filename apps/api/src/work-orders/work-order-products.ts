export interface DemoProduct {
  code: string;
  name: string;
  unit: string;
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  { code: "ECM-CTL-410", name: "산업용 제어 보드 CB-410", unit: "EA" },
  { code: "ECM-PWR-250", name: "전원 변환 모듈 PM-250", unit: "EA" },
  { code: "ECM-CTL-210", name: "소형 제어 보드 CB-210", unit: "EA" },
];

/** 이전 데모 제품 코드 → 현재 코드. seed가 기존 DB의 옛 데모 행을 새 코드로 옮길 때만 쓴다. */
export const RETIRED_DEMO_PRODUCT_CODES: Record<string, string> = {
  "ECM-CTL-640": "ECM-CTL-410",
  "ECM-PWR-1280": "ECM-PWR-250",
  "ECM-CTL-320-QC": "ECM-CTL-210",
};
