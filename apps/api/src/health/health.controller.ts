import { Controller, Get } from "@nestjs/common";

export interface HealthResponse {
  status: "ok";
  service: "fabriscope-api";
  timestamp: string;
}

@Controller("health")
export class HealthController {
  @Get()
  public getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "fabriscope-api",
      timestamp: new Date().toISOString(),
    };
  }
}
