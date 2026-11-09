export type DemoTraceRelation =
  | {
      kind: "CONSUME";
      materialLotNumber: string;
      productionLotNumber: string;
      quantity: number;
    }
  | {
      kind: "SPLIT";
      parentProductionLotNumber: string;
      childProductionLotNumber: string;
      quantity: number;
    }
  | {
      kind: "MERGE";
      parentProductionLotNumber: string;
      childProductionLotNumber: string;
      quantity: number;
    }
  | {
      kind: "TRANSFORM";
      parentProductionLotNumber: string;
      childProductionLotNumber: string;
      quantity: number;
    }
  | {
      kind: "SERIALIZE";
      productionLotNumber: string;
      serialNumber: string;
    };

// 투입 수량 = 제품당 BOM 소요량 × 생산 LOT 수량. 솔더 페이스트(g)는 LOT 단위 계보로 추적하지 않는다.
export const DEMO_TRACE_RELATIONS: DemoTraceRelation[] = [
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0301",
    productionLotNumber: "PL-2026-091A",
    quantity: 240,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0311",
    productionLotNumber: "PL-2026-091A",
    quantity: 120,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0321",
    productionLotNumber: "PL-2026-091A",
    quantity: 120,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0331",
    productionLotNumber: "PL-2026-091A",
    quantity: 480,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0301",
    productionLotNumber: "PL-2026-094A",
    quantity: 160,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0311",
    productionLotNumber: "PL-2026-094A",
    quantity: 80,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0323",
    productionLotNumber: "PL-2026-094A",
    quantity: 80,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0331",
    productionLotNumber: "PL-2026-094A",
    quantity: 320,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0301",
    productionLotNumber: "PL-2026-095A",
    quantity: 60,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0311",
    productionLotNumber: "PL-2026-095A",
    quantity: 60,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0321",
    productionLotNumber: "PL-2026-095A",
    quantity: 60,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0332",
    productionLotNumber: "PL-2026-095A",
    quantity: 120,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0301",
    productionLotNumber: "PL-2026-098A",
    quantity: 30,
  },
  {
    kind: "CONSUME",
    materialLotNumber: "ML-2026-0311",
    productionLotNumber: "PL-2026-098A",
    quantity: 30,
  },
  {
    kind: "SPLIT",
    parentProductionLotNumber: "PL-2026-097A",
    childProductionLotNumber: "PL-2026-097B",
    quantity: 30,
  },
  {
    kind: "SPLIT",
    parentProductionLotNumber: "PL-2026-097A",
    childProductionLotNumber: "PL-2026-097C",
    quantity: 20,
  },
  {
    kind: "MERGE",
    parentProductionLotNumber: "PL-2026-097B",
    childProductionLotNumber: "PL-2026-097M",
    quantity: 30,
  },
  {
    kind: "MERGE",
    parentProductionLotNumber: "PL-2026-097C",
    childProductionLotNumber: "PL-2026-097M",
    quantity: 20,
  },
  {
    kind: "TRANSFORM",
    parentProductionLotNumber: "PL-2026-095A",
    childProductionLotNumber: "PL-2026-095R",
    quantity: 20,
  },
  {
    kind: "SERIALIZE",
    productionLotNumber: "PL-2026-095A",
    serialNumber: "FU-2026-0001",
  },
  {
    kind: "SERIALIZE",
    productionLotNumber: "PL-2026-095A",
    serialNumber: "FU-2026-0002",
  },
  {
    kind: "SERIALIZE",
    productionLotNumber: "PL-2026-095A",
    serialNumber: "FU-2026-0003",
  },
];

/** 이전 seed가 만들었지만 지금 이야기에는 없는 계보. seed가 이 항목만 골라 지운다. */
export const RETIRED_DEMO_TRACE_RELATIONS = [
  { relationType: "CONSUME", parentLabel: "ML-2026-0302", childLabel: "PL-2026-091A" },
  { relationType: "CONSUME", parentLabel: "ML-2026-0321", childLabel: "PL-2026-094A" },
  { relationType: "CONSUME", parentLabel: "ML-2026-0331", childLabel: "PL-2026-095A" },
  { relationType: "MERGE", parentLabel: "PL-2026-094A", childLabel: "PL-2026-098B" },
  { relationType: "MERGE", parentLabel: "PL-2026-098A", childLabel: "PL-2026-098B" },
] as const;

/** 서로 다른 제품을 합치던 옛 합류 결과 LOT. 남은 관계가 없을 때만 지운다. */
export const RETIRED_DEMO_PRODUCTION_LOTS = ["PL-2026-098B"] as const;
