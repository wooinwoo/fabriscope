export const TRACE_NODE_TYPES = ["MATERIAL_LOT", "PRODUCTION_LOT"] as const;
export type TraceNodeType = (typeof TRACE_NODE_TYPES)[number];

export const LOT_RELATION_TYPES = ["CONSUME"] as const;
export type LotRelationType = (typeof LOT_RELATION_TYPES)[number];

export const TRACE_NODE_TYPE_LABELS: Record<TraceNodeType, string> = {
  MATERIAL_LOT: "자재 LOT",
  PRODUCTION_LOT: "생산 LOT",
};

export const LOT_RELATION_TYPE_LABELS: Record<LotRelationType, string> = {
  CONSUME: "투입",
};

export interface TraceNodeListItem {
  id: string;
  nodeType: TraceNodeType;
  label: string;
  materialLotId: string | null;
  productionLotNumber: string | null;
  upstreamCount: number;
  downstreamCount: number;
  createdAt: string;
}

export interface TraceNodeListResult {
  items: TraceNodeListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TraceEdgeView {
  id: string;
  relationType: LotRelationType;
  quantity: number;
  processStepExecutionId: string | null;
  createdAt: string;
  node: {
    id: string;
    nodeType: TraceNodeType;
    label: string;
  };
}

export interface TraceNodeDetail {
  id: string;
  nodeType: TraceNodeType;
  label: string;
  materialLotId: string | null;
  productionLotNumber: string | null;
  createdAt: string;
  upstream: TraceEdgeView[];
  downstream: TraceEdgeView[];
}
