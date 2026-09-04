export interface DemoTraceRelation {
  materialLotNumber: string;
  productionLotNumber: string;
  quantity: number;
}

export const DEMO_TRACE_RELATIONS: DemoTraceRelation[] = [
  {
    materialLotNumber: "ML-2026-0301",
    productionLotNumber: "PL-2026-091A",
    quantity: 40,
  },
  {
    materialLotNumber: "ML-2026-0302",
    productionLotNumber: "PL-2026-091A",
    quantity: 25,
  },
  {
    materialLotNumber: "ML-2026-0321",
    productionLotNumber: "PL-2026-094A",
    quantity: 60,
  },
  {
    materialLotNumber: "ML-2026-0311",
    productionLotNumber: "PL-2026-095A",
    quantity: 50,
  },
  {
    materialLotNumber: "ML-2026-0331",
    productionLotNumber: "PL-2026-095A",
    quantity: 35,
  },
];
