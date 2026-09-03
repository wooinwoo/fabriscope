import { createFileRoute } from "@tanstack/react-router";
import {
  requireRoutePermission,
  RoutePermission,
} from "@/app/session-policy";
import { RoleHomePage } from "@/pages/role-home";

export const Route = createFileRoute("/_authenticated/work-orders")({
  beforeLoad: ({ context, location }) =>
    requireRoutePermission(
      context.session,
      RoutePermission.WORK_ORDER_READ,
      location.href,
    ),
  component: WorkOrderLanding,
});

function WorkOrderLanding() {
  const { session } = Route.useRouteContext();
  return (
    <RoleHomePage
      description="생산 계획과 작업 진행의 기준이 되는 작업지시를 확인합니다."
      emptyDescription="작업지시 생성과 릴리스 흐름이 연결되면 이 권한으로 계획·차단 사유와 진행 상태를 조회합니다."
      emptyTitle="등록된 가상 작업지시가 없습니다"
      session={session}
      title="작업지시"
    />
  );
}
