import { Controller, Get, Header, Query, UseGuards } from "@nestjs/common";
import { Permission } from "../auth/auth.contract.js";
import { PermissionGuard, RequirePermissions } from "../auth/auth.guards.js";
import { InspectionsService } from "./inspections.service.js";
import type { InspectionListResult } from "./inspections.contract.js";

@Controller("inspections")
@UseGuards(PermissionGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  @RequirePermissions(Permission.INSPECTION_READ)
  async list(
    @Query() query: Record<string, string | string[] | undefined>,
  ): Promise<InspectionListResult> {
    return this.inspectionsService.list(this.inspectionsService.parseQuery(query));
  }
}
