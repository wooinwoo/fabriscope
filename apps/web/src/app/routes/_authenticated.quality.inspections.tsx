import { createFileRoute } from "@tanstack/react-router";
import {
  requireRoutePermission,
  RoutePermission,
} from "@/app/session-policy";
import { RoleHomePage } from "@/pages/role-home";

export const Route = createFileRoute("/_authenticated/quality/inspections")({
  beforeLoad: ({ context, location }) =>
    requireRoutePermission(
      context.session,
      RoutePermission.INSPECTION_READ,
      location.href,
    ),
  component: InspectionLanding,
});

function InspectionLanding() {
  const { session } = Route.useRouteContext();
  return (
    <RoleHomePage
      description="적용 규격과 측정값, 최근 유효 판정을 함께 확인합니다."
      emptyDescription="검사 요구사항이 생기면 이 권한으로 적용 revision과 판정 대기 항목을 조회합니다."
      emptyTitle="판정 대기 중인 가상 검사가 없습니다"
      session={session}
      title="품질검사"
    />
  );
}
