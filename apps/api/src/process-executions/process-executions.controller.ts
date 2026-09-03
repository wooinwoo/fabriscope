import { Controller, Get, Header, Query, UseGuards } from "@nestjs/common";
import { Permission } from "../auth/auth.contract.js";
import { PermissionGuard, RequirePermissions } from "../auth/auth.guards.js";
import { ProcessExecutionsService } from "./process-executions.service.js";
import type { ProcessExecutionListResult } from "./process-executions.contract.js";

@Controller("process-executions")
@UseGuards(PermissionGuard)
export class ProcessExecutionsController {
  constructor(private readonly processExecutionsService: ProcessExecutionsService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  @RequirePermissions(Permission.PROCESS_EXECUTION_READ)
  async list(
    @Query() query: Record<string, string | string[] | undefined>,
  ): Promise<ProcessExecutionListResult> {
    return this.processExecutionsService.list(
      this.processExecutionsService.parseQuery(query),
    );
  }
}
