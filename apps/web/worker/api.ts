// apps/api의 controller·service·guard를 Nest 없이 그대로 연결해 /api 요청을 처리한다.
// Nest와 같은 순서(전역 guard → controller guard → handler guard → handler)로 실행하고,
// 예외는 Nest 기본 예외 필터와 같은 status·본문으로 바꾼다.
import { PrismaNeon, PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client";
import { getMeta, HttpException, type ParamSpec } from "./shims/nest-common";
import { Reflector } from "./shims/nest-core";
import { AuthService } from "../../api/src/auth/auth.service";
import { AuthController } from "../../api/src/auth/auth.controller";
import { CsrfGuard, OriginGuard, PermissionGuard, SessionGuard } from "../../api/src/auth/auth.guards";
import { HealthController } from "../../api/src/health/health.controller";
import { AdminUsersService } from "../../api/src/admin-users/admin-users.service";
import { AdminUsersController } from "../../api/src/admin-users/admin-users.controller";
import { AuditEventsService } from "../../api/src/audit-events/audit-events.service";
import { AuditEventsController } from "../../api/src/audit-events/audit-events.controller";
import { BomsService } from "../../api/src/boms/boms.service";
import { BomsController } from "../../api/src/boms/boms.controller";
import { DashboardService } from "../../api/src/dashboard/dashboard.service";
import { DashboardController } from "../../api/src/dashboard/dashboard.controller";
import { InspectionsService } from "../../api/src/inspections/inspections.service";
import { InspectionVerdictService } from "../../api/src/inspections/inspection-verdict.service";
import { InspectionsController } from "../../api/src/inspections/inspections.controller";
import { MaterialLotsService } from "../../api/src/material-lots/material-lots.service";
import { MaterialLotDispositionService } from "../../api/src/material-lots/material-lot-disposition.service";
import { MaterialLotsController } from "../../api/src/material-lots/material-lots.controller";
import { MaterialReservationsService } from "../../api/src/material-reservations/material-reservations.service";
import {
  MaterialAllocationsController,
  MaterialReservationsController,
} from "../../api/src/material-reservations/material-reservations.controller";
import { ProcessExecutionsService } from "../../api/src/process-executions/process-executions.service";
import { ProcessCommandsService } from "../../api/src/process-executions/process-commands.service";
import { ProcessExecutionsController } from "../../api/src/process-executions/process-executions.controller";
import { QualityIncidentsService } from "../../api/src/quality-incidents/quality-incidents.service";
import { QualityIncidentsController } from "../../api/src/quality-incidents/quality-incidents.controller";
import { TraceabilityService } from "../../api/src/traceability/traceability.service";
import { TraceabilityController } from "../../api/src/traceability/traceability.controller";
import { WorkOrdersService } from "../../api/src/work-orders/work-orders.service";
import { WorkOrdersController } from "../../api/src/work-orders/work-orders.controller";

interface Guard {
  canActivate(context: unknown): unknown;
}

interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  controllerType: abstract new (...args: never[]) => object;
  handlerName: string;
  handler: (...args: unknown[]) => unknown;
}

type Handler = (...args: unknown[]) => unknown;

// controller를 요청마다 새 Prisma client로 만들기 위한 생성 함수 목록.
// Neon 연결은 요청 범위를 벗어나 재사용하면 안 되므로 client도 요청마다 만든다.
function buildControllers(prisma: never) {
  const auth = new AuthService(prisma);
  const reservations = new MaterialReservationsService(prisma);
  const controllers: object[] = [
    new HealthController(),
    new AuthController(auth),
    new AdminUsersController(new AdminUsersService(prisma)),
    new AuditEventsController(new AuditEventsService(prisma)),
    new BomsController(new BomsService(prisma)),
    new DashboardController(new DashboardService(prisma)),
    new InspectionsController(new InspectionsService(prisma), new InspectionVerdictService(prisma)),
    new MaterialLotsController(new MaterialLotsService(prisma), new MaterialLotDispositionService(prisma)),
    new MaterialReservationsController(reservations),
    new MaterialAllocationsController(reservations),
    new ProcessExecutionsController(new ProcessExecutionsService(prisma), new ProcessCommandsService(prisma)),
    new QualityIncidentsController(new QualityIncidentsService(prisma)),
    new TraceabilityController(new TraceabilityService(prisma)),
    new WorkOrdersController(new WorkOrdersService(prisma)),
  ];
  const guards = new Map<unknown, Guard>([
    [OriginGuard, new OriginGuard()],
    [SessionGuard, new SessionGuard(auth)],
    [CsrfGuard, new CsrfGuard(auth)],
    [PermissionGuard, new PermissionGuard(auth, new Reflector() as never)],
  ]);
  return { controllers, guards };
}

const controllerTypes = [
  HealthController,
  AuthController,
  AdminUsersController,
  AuditEventsController,
  BomsController,
  DashboardController,
  InspectionsController,
  MaterialLotsController,
  MaterialReservationsController,
  MaterialAllocationsController,
  ProcessExecutionsController,
  QualityIncidentsController,
  TraceabilityController,
  WorkOrdersController,
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compile(path: string) {
  const keys: string[] = [];
  const source = path
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (!segment.startsWith(":")) return escapeRegExp(segment);
      keys.push(segment.slice(1));
      return "([^/]+)";
    })
    .join("/");
  return { pattern: new RegExp(`^/${source}/?$`), keys };
}

// route 표는 데코레이터 메타데이터에서 한 번만 만든다.
const routes: Route[] = [];
for (const controllerType of controllerTypes) {
  const prefix = getMeta<string>(controllerType, "prefix") ?? "";
  const prototype = controllerType.prototype as Record<string, unknown>;
  for (const name of Object.getOwnPropertyNames(prototype)) {
    const handler = prototype[name];
    if (name === "constructor" || typeof handler !== "function") continue;
    const route = getMeta<{ method: string; path: string }>(handler, "route");
    if (route === undefined) continue;
    const { pattern, keys } = compile(`api/${prefix}/${route.path}`);
    routes.push({
      method: route.method,
      pattern,
      keys,
      controllerType: controllerType as unknown as Route["controllerType"],
      handlerName: name,
      handler: handler as Handler,
    });
  }
}
// 고정 경로(work-orders/products)가 파라미터 경로(work-orders/:id)보다 먼저 맞도록 정렬한다.
routes.sort((left, right) => left.keys.length - right.keys.length);

function findRoute(method: string, path: string) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(path);
    if (match === null) continue;
    const params = Object.fromEntries(route.keys.map((key, index) => [key, decodeURIComponent(match[index + 1]!)]));
    return { route, params };
  }
  return undefined;
}

function json(status: number, body: unknown, headers: Headers) {
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(body === undefined || body === null ? null : JSON.stringify(body), { status, headers });
}

export async function handleApi(
  request: Request,
  databaseUrl: string,
  waitUntil: (promise: Promise<unknown>) => void,
): Promise<Response> {
  const url = new URL(request.url);
  const headers = new Headers();
  const matched = findRoute(request.method.toUpperCase(), url.pathname);
  if (matched === undefined) {
    return json(404, { statusCode: 404, message: `Cannot ${request.method} ${url.pathname}`, error: "Not Found" }, headers);
  }

  const requestHeaders: Record<string, string> = {};
  request.headers.forEach((value, name) => {
    requestHeaders[name.toLowerCase()] = value;
  });
  const query: Record<string, string | string[]> = {};
  url.searchParams.forEach((value, key) => {
    const current = query[key];
    if (current === undefined) query[key] = value;
    else query[key] = [...(Array.isArray(current) ? current : [current]), value];
  });
  const text = request.method === "GET" || request.method === "HEAD" ? "" : await request.text();
  let body: unknown;
  try {
    body = text === "" ? undefined : JSON.parse(text);
  } catch {
    return json(400, { statusCode: 400, message: "Unexpected token in JSON", error: "Bad Request" }, headers);
  }

  const httpRequest: Record<string, unknown> = { method: request.method.toUpperCase(), headers: requestHeaders };
  const httpResponse = {
    setHeader(name: string, value: string | readonly string[]) {
      headers.delete(name);
      for (const item of Array.isArray(value) ? value : [value]) headers.append(name, String(item));
    },
  };

  // Neon 연결은 요청 범위를 벗어나 재사용하면 안 되므로 요청마다 client를 만든다.
  // 조회(GET·HEAD)는 HTTP 드라이버로 쿼리마다 한 번 왕복으로 끝낸다(WebSocket 연결을 맺지 않는다).
  // 데이터를 바꾸는 요청은 대화형 트랜잭션이 필요해 WebSocket 연결을 쓴다.
  const readOnly = request.method === "GET" || request.method === "HEAD";
  const adapter = readOnly ? new PrismaNeonHttp(databaseUrl, {}) : new PrismaNeon({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });
  try {
    const { controllers, guards } = buildControllers(prisma as never);
    const { route, params } = matched;
    const controller = controllers.find((item) => item instanceof route.controllerType)!;
    const context = {
      switchToHttp: () => ({ getRequest: () => httpRequest, getResponse: () => httpResponse }),
      getHandler: () => route.handler,
      getClass: () => route.controllerType,
    };

    const guardTypes = [
      OriginGuard,
      ...(getMeta<unknown[]>(route.controllerType, "guards") ?? []),
      ...(getMeta<unknown[]>(route.handler, "guards") ?? []),
    ];
    for (const guardType of guardTypes) {
      const guard = guards.get(guardType);
      if (guard === undefined) throw new Error("등록되지 않은 guard입니다.");
      await guard.canActivate(context);
    }

    const args: unknown[] = [];
    for (const spec of getMeta<ParamSpec[]>(route.handler, "params") ?? []) {
      if (spec.kind === "body") args[spec.index] = body;
      else if (spec.kind === "query") args[spec.index] = query;
      else if (spec.kind === "param") args[spec.index] = params[spec.name!];
      else if (spec.kind === "req") args[spec.index] = httpRequest;
      else args[spec.index] = httpResponse;
    }
    for (const [name, value] of getMeta<[string, string][]>(route.handler, "headers") ?? []) {
      headers.set(name, value);
    }

    const result = await (controller as Record<string, Handler>)[route.handlerName]!(...args);
    const status = getMeta<number>(route.handler, "httpCode") ?? (route.method === "POST" ? 201 : 200);
    return json(status, result, headers);
  } catch (error) {
    if (error instanceof HttpException) {
      return json(error.getStatus(), error.getResponse(), headers);
    }
    console.error("[api]", error);
    return json(500, { statusCode: 500, message: "Internal server error" }, headers);
  } finally {
    // 연결 정리는 응답을 보낸 뒤 진행한다. 정리를 기다리면 응답이 늦어지거나 멈출 수 있다.
    waitUntil(prisma.$disconnect().catch(() => undefined));
  }
}
