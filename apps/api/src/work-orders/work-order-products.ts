export interface DemoProduct {
  code: string;
  name: string;
  unit: string;
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  { code: "ECM-CTL-640", name: "산업용 제어 보드 CB-640", unit: "EA" },
  { code: "ECM-PWR-1280", name: "전원 변환 모듈 PM-1280", unit: "EA" },
  { code: "ECM-CTL-320-QC", name: "제어 보드 CB-320 QC 버전", unit: "EA" },
];
