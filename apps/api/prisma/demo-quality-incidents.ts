const seoulStartOfToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return Date.parse(`${parts}T00:00:00+09:00`);
};

const dayOffset = (days: number, hour = 10) =>
  new Date(seoulStartOfToday() + days * 86_400_000 + hour * 3_600_000);

export interface DemoQualityIncident {
  incidentNumber: string;
  title: string;
  sourceType: "MATERIAL_LOT" | "PRODUCTION_LOT" | "FINISHED_UNIT";
  sourceLotNumber: string;
  description: string | null;
  status: "OPEN" | "ASSESSED" | "CONTAINED" | "CLOSED";
  detectedAt: Date;
  resolvedAt: Date | null;
}

export const DEMO_QUALITY_INCIDENTS: DemoQualityIncident[] = [
  {
    incidentNumber: "QI-2026-0701",
    title: "방열 히트싱크 밀착 불량으로 발열 시험 기준 초과",
    sourceType: "MATERIAL_LOT",
    sourceLotNumber: "ML-2026-0323",
    description:
      "PL-2026-094A 기구 조립 검사에서 히트싱크 밀착 불량과 온도 상승 초과 확인. 같은 히트싱크 LOT 사용을 중단하고 격리 조사 중.",
    status: "OPEN",
    detectedAt: dayOffset(-1, 14),
    resolvedAt: null,
  },
  {
    incidentNumber: "QI-2026-0688",
    title: "방열 히트싱크 표면 찍힘 신고",
    sourceType: "MATERIAL_LOT",
    sourceLotNumber: "ML-2026-0322",
    description: "입고 후 현장 작업자 신고. 사용 전에 보류해 영향 생산 LOT 없음. 공급사 재검토 결과 대기 중.",
    status: "CONTAINED",
    detectedAt: dayOffset(-6, 11),
    resolvedAt: null,
  },
  {
    incidentNumber: "QI-2026-0651",
    title: "신호 커넥터 접점 도금 불량 사후 발견",
    sourceType: "MATERIAL_LOT",
    sourceLotNumber: "ML-2026-0332",
    description:
      "출하 후 접점 불량 신고로 역추적. 이 LOT를 쓴 PL-2026-095A와 완제품 FU-2026-0001~0003을 확인하고 남은 80 EA는 폐기 처분 완료.",
    status: "CLOSED",
    detectedAt: dayOffset(-2, 10),
    resolvedAt: dayOffset(-1, 18),
  },
];
