import { BookOpen, LogOut } from "lucide-react";
import type { ComponentType } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@convex/_generated/api";

export type MenuItem = {
  path: string;
  title: string;
  icon: ComponentType;
};

interface AppSidebarProps {
  items: MenuItem[];
  roleLabel: string;
}

export function AppSidebar({ items, roleLabel }: AppSidebarProps) {
  const { signOut } = useAuthActions();
  const user = useQuery(api.model.user.queries.currentUser);
  const { pathname } = useLocation();

  const initial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center gap-2.5 overflow-hidden px-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="size-4" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-base font-bold tracking-tight">LaBiblio</span>
            <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname.startsWith(item.path)}
                    className="h-9 data-active:bg-sidebar-accent data-active:font-semibold data-active:text-sidebar-accent-foreground"
                    render={<NavLink to={item.path} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-2">
        <div className="flex items-center gap-3 overflow-hidden rounded-lg border bg-muted/40 p-2 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            {user === undefined ? (
              <span className="text-sm text-muted-foreground">Carregando...</span>
            ) : (
              <>
                <span className="truncate text-[13px] font-medium">{user?.name ?? "Usuário"}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </>
            )}
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => void signOut()}
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
