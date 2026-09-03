import { createFileRoute } from "@tanstack/react-router";
import {
  requireRoutePermission,
  RoutePermission,
} from "@/app/session-policy";
import { RoleHomePage } from "@/pages/role-home";

export const Route = createFileRoute("/_authenticated/materials/lots")({
  beforeLoad: ({ context, location }) =>
    requireRoutePermission(
      context.session,
      RoutePermission.MATERIAL_LOT_READ,
      location.href,
    ),
  component: MaterialLotLanding,
});

function MaterialLotLanding() {
  const { session } = Route.useRouteContext();
  return (
    <RoleHomePage
      description="자재 LOT의 재고, 예약과 현재 품질 상태를 구분해 확인합니다."
      emptyDescription="자재 입고와 예약 흐름이 연결되면 이 권한으로 LOT별 가용량과 차단 근거를 조회합니다."
      emptyTitle="등록된 가상 자재 LOT가 없습니다"
      session={session}
      title="자재 LOT"
    />
  );
}
