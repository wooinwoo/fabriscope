/**
 * Adapted from shadcn-admin@e16c87f213a5ba5e45964e9b67c792105ec74d26.
 * Copyright (c) 2024 Sat Naing. MIT License; see THIRD_PARTY_NOTICES.md.
 */
import { Link } from "@tanstack/react-router";
import { Factory } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui";

export function AppTitle() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" className="p-0 group-data-[collapsible=icon]:p-1!">
          <Link onClick={() => setOpenMobile(false)} to="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-brand bg-sidebar-primary text-sidebar-primary-foreground">
              <Factory className="size-4" aria-hidden="true" />
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-bold tracking-tight">FabriScope MES</span>
              <span className="mt-1 truncate text-xs text-sidebar-muted">
                부품 제조 운영
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
