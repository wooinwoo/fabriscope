// Cloudflare Worker용 @nestjs/common 대체 모듈.
// apps/api의 controller·service·guard를 그대로 쓰기 위해 데코레이터는 route 메타데이터만 기록하고,
// 예외 클래스는 Nest와 같은 status·응답 본문을 만든다.
const metadataStore = new WeakMap<object, Map<string, unknown>>();

function setMeta(target: object, key: string, value: unknown) {
  let entries = metadataStore.get(target);
  if (entries === undefined) {
    entries = new Map();
    metadataStore.set(target, entries);
  }
  entries.set(key, value);
}

export function getMeta<T>(target: object, key: string): T | undefined {
  return metadataStore.get(target)?.get(key) as T | undefined;
}

type Decorator = (target: object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => void;

function owner(target: object, descriptor?: PropertyDescriptor) {
  return (descriptor?.value as object | undefined) ?? target;
}

function decorate(key: string, value: unknown): Decorator {
  return (target, _propertyKey, descriptor) => setMeta(owner(target, descriptor), key, value);
}

export const Injectable = (): ClassDecorator => () => undefined;
export const Module = (): ClassDecorator => () => undefined;
export const Controller = (prefix = ""): ClassDecorator => (target) => setMeta(target, "prefix", prefix);
export const Get = (path = "") => decorate("route", { method: "GET", path });
export const Post = (path = "") => decorate("route", { method: "POST", path });
export const HttpCode = (status: number) => decorate("httpCode", status);
export const SetMetadata = (key: string, value: unknown) => decorate(key, value);

export const Header = (name: string, value: string): Decorator => (target, _key, descriptor) => {
  const target_ = owner(target, descriptor);
  setMeta(target_, "headers", [...(getMeta<[string, string][]>(target_, "headers") ?? []), [name, value]]);
};

export const UseGuards = (...guards: unknown[]): Decorator => (target, _key, descriptor) => {
  const target_ = owner(target, descriptor);
  setMeta(target_, "guards", [...(getMeta<unknown[]>(target_, "guards") ?? []), ...guards]);
};

export type ParamKind = "body" | "query" | "param" | "req" | "res";
export interface ParamSpec {
  index: number;
  kind: ParamKind;
  name?: string;
}

function paramDecorator(kind: ParamKind, name?: string): ParameterDecorator {
  return (target, propertyKey, index) => {
    if (propertyKey === undefined) return;
    const method = (target as Record<string | symbol, object>)[propertyKey]!;
    setMeta(method, "params", [...(getMeta<ParamSpec[]>(method, "params") ?? []), { index, kind, name }]);
  };
}

export const Body = () => paramDecorator("body");
export const Query = () => paramDecorator("query");
export const Param = (name: string) => paramDecorator("param", name);
export const Req = () => paramDecorator("req");
export const Res = () => paramDecorator("res");

export class HttpException extends Error {
  constructor(
    private readonly body: string | Record<string, unknown>,
    private readonly status: number,
  ) {
    super(typeof body === "string" ? body : String(body.message ?? ""));
  }

  getStatus() {
    return this.status;
  }

  getResponse() {
    return typeof this.body === "string" ? { statusCode: this.status, message: this.body } : this.body;
  }
}

function httpError(status: number, fallback: string) {
  return class extends HttpException {
    constructor(body: string | Record<string, unknown> = fallback) {
      super(body, status);
    }
  };
}

export const BadRequestException = httpError(400, "Bad Request");
export const UnauthorizedException = httpError(401, "Unauthorized");
export const ForbiddenException = httpError(403, "Forbidden");
export const NotFoundException = httpError(404, "Not Found");
export const ConflictException = httpError(409, "Conflict");

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

export interface ExecutionContext {
  switchToHttp(): { getRequest<T>(): T; getResponse<T>(): T };
  getHandler(): object;
  getClass(): object;
}

export interface OnModuleDestroy {
  onModuleDestroy(): unknown;
}
