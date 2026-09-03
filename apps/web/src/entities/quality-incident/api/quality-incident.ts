import { requestJson } from "@/shared/api";
import type { QualityIncidentListResult } from "../model/quality-incident";

export async function fetchQualityIncidents(
  searchParams: URLSearchParams,
  signal?: AbortSignal,
): Promise<QualityIncidentListResult> {
  const query = searchParams.toString();
  return requestJson<QualityIncidentListResult>(
    `/api/quality-incidents${query === "" ? "" : `?${query}`}`,
    { ...(signal !== undefined ? { signal } : {}) },
  );
}
