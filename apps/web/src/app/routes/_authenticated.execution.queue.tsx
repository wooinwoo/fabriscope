import { createFileRoute } from "@tanstack/react-router";
import {
  requireRoutePermission,
  RoutePermission,
} from "@/app/session-policy";
import { RoleHomePage } from "@/pages/role-home";

export const Route = createFileRoute("/_authenticated/execution/queue")({
  beforeLoad: ({ context, location }) =>
    requireRoutePermission(
      context.session,
      RoutePermission.PROCESS_EXECUTION_READ,
      location.href,
    ),
  component: ExecutionLanding,
});

function ExecutionLanding() {
  const { session } = Route.useRouteContext();
  return (
    <RoleHomePage
      description="현재 작업 대상과 공정 순서를 확인하고 생산 실적을 기록합니다."
      emptyDescription="릴리스된 작업지시가 생기면 이 권한으로 공정 대기열과 투입 가능한 생산 LOT를 확인합니다."
      emptyTitle="실행 대기 중인 가상 공정이 없습니다"
      session={session}
      title="공정 실행"
    />
  );
}
