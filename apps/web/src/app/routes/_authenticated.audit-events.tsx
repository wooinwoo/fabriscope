import { createFileRoute } from "@tanstack/react-router";
import {
  requireRoutePermission,
  RoutePermission,
} from "@/app/session-policy";
import { RoleHomePage } from "@/pages/role-home";

export const Route = createFileRoute("/_authenticated/audit-events")({
  beforeLoad: ({ context, location }) =>
    requireRoutePermission(
      context.session,
      RoutePermission.AUDIT_EVENT_READ,
      location.href,
    ),
  component: AuditLanding,
});

function AuditLanding() {
  const { session } = Route.useRouteContext();
  return (
    <RoleHomePage
      description="중요 명령의 행위자, 사유와 변경 근거를 통합 조회합니다."
      emptyDescription="첫 제조 명령이 기록되면 이 권한으로 요청 ID와 전후 상태를 검색합니다."
      emptyTitle="기록된 가상 감사 이벤트가 없습니다"
      session={session}
      title="감사이력"
    />
  );
}
