import { BookMarked, LibraryBig } from "lucide-react";
import type { AppRoute } from "./components/shared/AppLayout";
import { BookCatalogoPage } from "./alunosPages/booksCatalogo/page/BookCatalogoPage";
import { AluguelPages } from "./alunosPages/aluguelHistory/pages/AluguelPages";

export type RouteAlunoConfig = AppRoute;

export const alunoRoutes: RouteAlunoConfig[] = [
  {
    path: "/aluno/livros",
    title: "Catálogo de livros",
    icon: BookMarked,
    component: BookCatalogoPage,
    showInMenu: true,
  },
  {
    path: "/aluno/historico",
    title: "Meus empréstimos",
    icon: LibraryBig,
    component: AluguelPages,
    showInMenu: true,
  },
];
