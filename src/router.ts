import { Home, LibraryBig, Users, Briefcase } from "lucide-react";
import type { AppRoute } from "./components/shared/AppLayout";
import { HomePage } from "./pages/home/HomePage";
import { BookPages } from "./pages/books/page/BookPages";
import { AlunosPage } from "./pages/alunos/page/AlunosPage";
import { ColaboradoresPage } from "./pages/colaboradores/page/ColaboradoresPage";

export type RouteConfig = AppRoute;

export const routes: RouteConfig[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: Home,
    component: HomePage,
    showInMenu: true,
  },
  {
    path: "/bookPage",
    title: "Livros",
    icon: LibraryBig,
    component: BookPages,
    showInMenu: true,
  },
  {
    path: "/alunos",
    title: "Alunos",
    icon: Users,
    component: AlunosPage,
    showInMenu: true,
  },
  {
    path: "/colaboradores",
    title: "Colaboradores",
    icon: Briefcase,
    component: ColaboradoresPage,
    showInMenu: true,
  },
];

export const menuItems = routes.filter((r) => r.showInMenu);
