import { RoleCode } from "../generated/prisma/enums.js";

export const DEMO_PASSWORD = "FabriDemo!2026";

export const DEMO_ACCOUNTS = [
  {
    id: "demo-production-planner",
    email: "planner.demo@fabriscope.local",
    displayName: "생산계획 데모",
    role: RoleCode.PRODUCTION_PLANNER,
  },
  {
    id: "demo-material-manager",
    email: "material.demo@fabriscope.local",
    displayName: "자재 데모",
    role: RoleCode.MATERIAL_MANAGER,
  },
  {
    id: "demo-shop-floor-operator",
    email: "operator.demo@fabriscope.local",
    displayName: "현장 작업 데모",
    role: RoleCode.SHOP_FLOOR_OPERATOR,
  },
  {
    id: "demo-quality-engineer",
    email: "quality.demo@fabriscope.local",
    displayName: "품질 데모",
    role: RoleCode.QUALITY_ENGINEER,
  },
  {
    id: "demo-system-admin",
    email: "admin.demo@fabriscope.local",
    displayName: "관리자 데모",
    role: RoleCode.SYSTEM_ADMIN,
  },
] as const;
