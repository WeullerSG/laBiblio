/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as alugueis from "../alugueis.js";
import type * as alunos from "../alunos.js";
import type * as auth from "../auth.js";
import type * as books from "../books.js";
import type * as colaboradores from "../colaboradores.js";
import type * as http from "../http.js";
import type * as model_alugueis_action from "../model/alugueis/action.js";
import type * as model_alugueis_mutation from "../model/alugueis/mutation.js";
import type * as model_alugueis_query from "../model/alugueis/query.js";
import type * as model_alunos_actions from "../model/alunos/actions.js";
import type * as model_alunos_mutation from "../model/alunos/mutation.js";
import type * as model_alunos_passwordReset from "../model/alunos/passwordReset.js";
import type * as model_alunos_query from "../model/alunos/query.js";
import type * as model_books_mutation from "../model/books/mutation.js";
import type * as model_books_query from "../model/books/query.js";
import type * as model_colaboradores_mutation from "../model/colaboradores/mutation.js";
import type * as model_colaboradores_query from "../model/colaboradores/query.js";
import type * as model_user_queries from "../model/user/queries.js";
import type * as user from "../user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  alugueis: typeof alugueis;
  alunos: typeof alunos;
  auth: typeof auth;
  books: typeof books;
  colaboradores: typeof colaboradores;
  http: typeof http;
  "model/alugueis/action": typeof model_alugueis_action;
  "model/alugueis/mutation": typeof model_alugueis_mutation;
  "model/alugueis/query": typeof model_alugueis_query;
  "model/alunos/actions": typeof model_alunos_actions;
  "model/alunos/mutation": typeof model_alunos_mutation;
  "model/alunos/passwordReset": typeof model_alunos_passwordReset;
  "model/alunos/query": typeof model_alunos_query;
  "model/books/mutation": typeof model_books_mutation;
  "model/books/query": typeof model_books_query;
  "model/colaboradores/mutation": typeof model_colaboradores_mutation;
  "model/colaboradores/query": typeof model_colaboradores_query;
  "model/user/queries": typeof model_user_queries;
  user: typeof user;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
