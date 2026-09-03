import { BadRequestException, Injectable } from "@nestjs/common";
import type { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";
import {
  WORK_ORDER_DUE_FILTERS,
  WORK_ORDER_PRIORITIES,
  WORK_ORDER_SORT_FIELDS,
  WORK_ORDER_STATUSES,
  type WorkOrderDueFilter,
  type WorkOrderListItem,
  type WorkOrderListResult,
  type WorkOrderSortField,
} from "./work-orders.contract.js";
import type { WorkOrderPriority, WorkOrderStatus } from "../generated/prisma/enums.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

interface WorkOrderQuery {
  q?: string;
  status: readonly WorkOrderStatus[];
  priority: readonly WorkOrderPriority[];
  due: WorkOrderDueFilter;
  blocked: boolean | undefined;
  sort: WorkOrderSortField;
  order: "asc" | "desc";
  page: number;
  pageSize: number;
}

function invalidQuery(detail: string) {  return new BadRequestException({
    code: "INVALID_WORK_ORDER_QUERY",
    message: "작업지시 조회 조건이 올바르지 않습니다.",
    detail,
  });
}

function parseEnumArray<T extends string>(
  raw: string | undefined,
  allowed: readonly T[],
  label: string,
): readonly T[] {
  if (raw === undefined || raw === "") {
    return [];
  }
  const values = raw.split(",").map((value) => value.trim());
  for (const value of values) {
    if (!allowed.includes(value as T)) {
      throw invalidQuery(`${label}에 허용되지 않는 값: ${value}`);
    }
  }
  return values as unknown as readonly T[];
}

function seoulStartOfToday(): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return new Date(Date.parse(`${parts}T00:00:00+09:00`));
}

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  parseQuery(query: Record<string, string | string[] | undefined>): WorkOrderQuery {
    const read = (key: string): string | undefined => {
      const value = query[key];
      const first = Array.isArray(value) ? value[0] : value;
      return first === undefined || first === "" ? undefined : first;
    };

    const status = parseEnumArray(read("status"), WORK_ORDER_STATUSES, "status");
    const priority = parseEnumArray(read("priority"), WORK_ORDER_PRIORITIES, "priority");

    const dueRaw = read("due") ?? "all";
    const due = WORK_ORDER_DUE_FILTERS.find((value) => value === dueRaw);
    if (due === undefined) {
      throw invalidQuery(`due에 허용되지 않는 값: ${dueRaw}`);
    }

    const blockedRaw = read("blocked");
    let blocked: boolean | undefined;
    if (blockedRaw !== undefined) {
      if (blockedRaw !== "true" && blockedRaw !== "false") {
        throw invalidQuery(`blocked은 boolean이어야 합니다: ${blockedRaw}`);
      }
      blocked = blockedRaw === "true";
    }

    const sortRaw = (read("sort") ?? "dueDate") as WorkOrderSortField;
    if (!WORK_ORDER_SORT_FIELDS.includes(sortRaw)) {
      throw invalidQuery(`sort에 허용되지 않는 값: ${sortRaw}`);
    }

    const orderRaw = read("order") ?? "asc";
    if (orderRaw !== "asc" && orderRaw !== "desc") {
      throw invalidQuery(`order는 asc 또는 desc여야 합니다: ${orderRaw}`);
    }

    const page = parsePositiveInt(read("page") ?? null, 1, "page");
    const pageSize = parsePositiveInt(read("pageSize") ?? null, DEFAULT_PAGE_SIZE, "pageSize");
    if (pageSize > MAX_PAGE_SIZE) {
      throw invalidQuery(`pageSize는 ${MAX_PAGE_SIZE} 이하여야 합니다.`);
    }

    const q = read("q")?.trim();
    return {
      ...(q ? { q } : {}),
      status,
      priority,
      due,
      blocked,
      sort: sortRaw,
      order: orderRaw,
      page,
      pageSize,
    };
  }

  async list(query: WorkOrderQuery): Promise<WorkOrderListResult> {
    const where = this.buildWhere(query);
    const { rows, total } = await this.prisma.$transaction(async (transaction) => {
      const rows = await transaction.workOrder.findMany({
        where,
        orderBy: this.buildOrderBy(query),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      });
      const total = await transaction.workOrder.count({ where });
      return { rows, total };
    });

    return {
      items: rows.map(toListItem),
      page: query.page,
      pageSize: query.pageSize,
      total,
    };
  }

  private buildWhere(query: WorkOrderQuery): Prisma.WorkOrderWhereInput {
    const where: Prisma.WorkOrderWhereInput = {};
    if (query.q) {
      where.OR = [
        { orderNumber: { contains: query.q, mode: "insensitive" } },
        { productCode: { contains: query.q, mode: "insensitive" } },
        { productName: { contains: query.q, mode: "insensitive" } },
      ];
    }
    if (query.status.length > 0) {
      where.status = { in: [...query.status] };
    }
    if (query.priority.length > 0) {
      where.priority = { in: [...query.priority] };
    }
    if (query.blocked !== undefined) {
      where.blockedReason = query.blocked ? { not: null } : null;
    }
    const dueRange = this.dueRange(query.due);
    if (dueRange) {
      where.dueDate = dueRange;
    }
    return where;
  }

  private dueRange(
    due: WorkOrderDueFilter,
  ): Prisma.DateTimeFilter | undefined {
    if (due === "all") {
      return undefined;
    }
    const start = seoulStartOfToday();
    if (due === "overdue") {
      return { lt: start };
    }
    if (due === "today") {
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      return { gte: start, lt: end };
    }
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return { gte: start, lt: end };
  }

  private buildOrderBy(query: WorkOrderQuery): Prisma.WorkOrderOrderByWithRelationInput[] {
    return [{ [query.sort]: query.order }, { orderNumber: "asc" }];
  }
}

function parsePositiveInt(
  raw: string | null,
  fallback: number,
  label: string,
): number {
  if (raw === null || raw === "") {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) {
    throw invalidQuery(`${label}은 1 이상 정수여야 합니다: ${raw}`);
  }
  return value;
}

function toListItem(row: {
  id: string;
  orderNumber: string;
  productCode: string;
  productName: string;
  plannedQuantity: number;
  unit: string;
  dueDate: Date;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  progressPercent: number;
  currentStepName: string | null;
  blockedReason: string | null;
}): WorkOrderListItem {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    productCode: row.productCode,
    productName: row.productName,
    plannedQuantity: row.plannedQuantity,
    unit: row.unit,
    dueDate: row.dueDate.toISOString(),
    status: row.status,
    priority: row.priority,
    progressPercent: row.progressPercent,
    currentStepName: row.currentStepName,
    blockedReason: row.blockedReason,
  };
}
