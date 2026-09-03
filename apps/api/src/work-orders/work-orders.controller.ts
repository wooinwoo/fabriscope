import { Controller, Get, Header, Query, UseGuards } from "@nestjs/common";
import { Permission } from "../auth/auth.contract.js";
import { PermissionGuard, RequirePermissions } from "../auth/auth.guards.js";
import { WorkOrdersService } from "./work-orders.service.js";
import type { WorkOrderListResult } from "./work-orders.contract.js";

@Controller("work-orders")
@UseGuards(PermissionGuard)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  @RequirePermissions(Permission.WORK_ORDER_READ)
  async list(
    @Query() query: Record<string, string | string[] | undefined>,
  ): Promise<WorkOrderListResult> {
    return this.workOrdersService.list(this.workOrdersService.parseQuery(query));
  }
}
