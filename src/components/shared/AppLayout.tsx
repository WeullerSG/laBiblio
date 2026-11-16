import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ComponentType } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export type AppRoute = {
  path: string;
  title: string;
  icon: ComponentType;
  component: ComponentType;
  showInMenu: boolean;
};

interface AppLayoutProps {
  routes: AppRoute[];
  roleLabel: string;
}

export function AppLayout({ routes, roleLabel }: AppLayoutProps) {
  const { pathname } = useLocation();
  const current = routes.find((r) => pathname.startsWith(r.path));
  const menuItems = routes.filter((r) => r.showInMenu);

  return (
    <SidebarProvider>
      <AppSidebar items={menuItems} roleLabel={roleLabel} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            {current?.title ?? "LaBiblio"}
          </span>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
            <Route path="*" element={<Navigate to={routes[0].path} replace />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
