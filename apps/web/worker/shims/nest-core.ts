// Cloudflare Worker용 @nestjs/core 대체 모듈. guard가 쓰는 Reflector만 제공한다.
import { getMeta } from "./nest-common";

export const APP_GUARD = "APP_GUARD";

export class Reflector {
  getAllAndOverride<T>(key: string, targets: object[]): T | undefined {
    for (const target of targets) {
      const value = getMeta<T>(target, key);
      if (value !== undefined) return value;
    }
    return undefined;
  }
}
