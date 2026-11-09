const seoulStartOfToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return Date.parse(`${parts}T00:00:00+09:00`);
};

const dayOffset = (days: number, hour = 9) =>
  new Date(seoulStartOfToday() + days * 86_400_000 + hour * 3_600_000);

export interface DemoMaterial {
  code: string;
  name: string;
  unit: string;
}

export const DEMO_MATERIALS: DemoMaterial[] = [
  { code: "ECM-MAT-014", name: "메인 MCU 칩", unit: "EA" },
  { code: "ECM-MAT-021", name: "다층 PCB 기판", unit: "EA" },
  { code: "ECM-MAT-032", name: "방열 히트싱크", unit: "EA" },
  { code: "ECM-MAT-045", name: "신호 커넥터", unit: "EA" },
  { code: "ECM-MAT-051", name: "무연 솔더 페이스트", unit: "g" },
];

export interface DemoMaterialLot {
  lotNumber: string;
  materialCode: string;
  receivedQuantity: number;
  onHand: number;
  reservedQuantity: number;
  consumedQuantity: number;
  scrappedQuantity: number;
  qualityDisposition: "PENDING" | "ACCEPTED" | "HOLD" | "QUARANTINED" | "REJECTED";
  expiresAt: Date | null;
  receivedAt: Date;
}

// 입고량 = 현재고 + 투입 + 폐기. 유효기간은 MCU(MSL 포장)·PCB·솔더 페이스트에만 둔다.
export const DEMO_MATERIAL_LOTS: DemoMaterialLot[] = [
  {
    lotNumber: "ML-2026-0301",
    materialCode: "ECM-MAT-014",
    receivedQuantity: 500,
    onHand: 10,
    reservedQuantity: 0,
    consumedQuantity: 490,
    scrappedQuantity: 0,
    qualityDisposition: "ACCEPTED",
    expiresAt: dayOffset(200),
    receivedAt: dayOffset(-60),
  },
  {
    lotNumber: "ML-2026-0302",
    materialCode: "ECM-MAT-014",
    receivedQuantity: 300,
    onHand: 300,
    reservedQuantity: 300,
    consumedQuantity: 0,
    scrappedQuantity: 0,
    qualityDisposition: "ACCEPTED",
    expiresAt: dayOffset(220),
    receivedAt: dayOffset(-12),
  },
  {
    lotNumber: "ML-2026-0303",
    materialCode: "ECM-MAT-014",
    receivedQuantity: 200,
    onHand: 200,
    reservedQuantity: 0,
    consumedQuantity: 0,
    scrappedQuantity: 0,
    qualityDisposition: "ACCEPTED",
    expiresAt: dayOffset(-2),
    receivedAt: dayOffset(-380),
  },
  {
    lotNumber: "ML-2026-0311",
    materialCode: "ECM-MAT-021",
    receivedQuantity: 800,
    onHand: 510,
    reservedQuantity: 100,
    consumedQuantity: 290,
    scrappedQuantity: 0,
    qualityDisposition: "ACCEPTED",
    expiresAt: dayOffset(150),
    receivedAt: dayOffset(-20),
  },
  {
    lotNumber: "ML-2026-0312",
    materialCode: "ECM-MAT-021",
    receivedQuantity: 400,
    onHand: 400,
    reservedQuantity: 0,
    consumedQuantity: 0,
    scrappedQuantity: 0,
    qualityDisposition: "PENDING",
    expiresAt: dayOffset(178),
    receivedAt: dayOffset(-2),
  },
  {
    lotNumber: "ML-2026-0321",
    materialCode: "ECM-MAT-032",
    receivedQuantity: 300,
    onHand: 120,
    reservedQuantity: 40,
    consumedQuantity: 180,
    scrappedQuantity: 0,
    qualityDisposition: "ACCEPTED",
    expiresAt: null,
    receivedAt: dayOffset(-25),
  },
  {
    lotNumber: "ML-2026-0322",
    materialCode: "ECM-MAT-032",
    receivedQuantity: 150,
    onHand: 150,
    reservedQuantity: 0,
    consumedQuantity: 0,
    scrappedQuantity: 0,
    qualityDisposition: "HOLD",
    expiresAt: null,
    receivedAt: dayOffset(-8),
  },
  {
    lotNumber: "ML-2026-0323",
    materialCode: "ECM-MAT-032",
    receivedQuantity: 100,
    onHand: 20,
    reservedQuantity: 0,
    consumedQuantity: 80,
    scrappedQuantity: 0,
    qualityDisposition: "QUARANTINED",
    expiresAt: null,
    receivedAt: dayOffset(-30),
  },
  {
    lotNumber: "ML-2026-0331",
    materialCode: "ECM-MAT-045",
    receivedQuantity: 1000,
    onHand: 200,
    reservedQuantity: 120,
    consumedQuantity: 800,
    scrappedQuantity: 0,
    qualityDisposition: "ACCEPTED",
    expiresAt: null,
    receivedAt: dayOffset(-60),
  },
  {
    lotNumber: "ML-2026-0332",
    materialCode: "ECM-MAT-045",
    receivedQuantity: 200,
    onHand: 0,
    reservedQuantity: 0,
    consumedQuantity: 120,
    scrappedQuantity: 80,
    qualityDisposition: "REJECTED",
    expiresAt: null,
    receivedAt: dayOffset(-55),
  },
  {
    lotNumber: "ML-2026-0341",
    materialCode: "ECM-MAT-051",
    receivedQuantity: 2000,
    onHand: 895,
    reservedQuantity: 0,
    consumedQuantity: 1105,
    scrappedQuantity: 0,
    qualityDisposition: "ACCEPTED",
    expiresAt: dayOffset(150),
    receivedAt: dayOffset(-30),
  },
];
