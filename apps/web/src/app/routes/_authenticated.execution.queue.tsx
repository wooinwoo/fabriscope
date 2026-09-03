import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  requireRoutePermission,
  RoutePermission,
} from "@/app/session-policy";
import { ExecutionQueuePage, readExecutionQueueSearch } from "@/pages/execution-queue";

export const Route = createFileRoute("/_authenticated/execution/queue")({
  validateSearch: (search: Record<string, unknown>) =>
    readExecutionQueueSearch(search),
  beforeLoad: ({ context, location }) =>
    requireRoutePermission(
      context.session,
      RoutePermission.PROCESS_EXECUTION_READ,
      location.href,
    ),
  component: ExecutionQueueRoute,
});

function ExecutionQueueRoute() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <ExecutionQueuePage
      search={search}
      onSearchChange={(next) => {
        void navigate({
          to: "/execution/queue",
          search: next,
          replace: true,
        });
      }}
    />
  );
}
