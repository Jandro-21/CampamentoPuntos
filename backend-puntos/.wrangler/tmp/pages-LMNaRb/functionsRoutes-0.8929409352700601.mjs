import { onRequestDelete as __api_teams__id__js_onRequestDelete } from "C:\\Users\\aleja\\Desktop\\Proyectos\\CampamentoPuntos\\backend-puntos\\functions\\api\\teams\\[id].js"
import { onRequestOptions as __api_login_js_onRequestOptions } from "C:\\Users\\aleja\\Desktop\\Proyectos\\CampamentoPuntos\\backend-puntos\\functions\\api\\login.js"
import { onRequestPost as __api_login_js_onRequestPost } from "C:\\Users\\aleja\\Desktop\\Proyectos\\CampamentoPuntos\\backend-puntos\\functions\\api\\login.js"
import { onRequestGet as __api_logs_js_onRequestGet } from "C:\\Users\\aleja\\Desktop\\Proyectos\\CampamentoPuntos\\backend-puntos\\functions\\api\\logs.js"
import { onRequestPatch as __api_points_js_onRequestPatch } from "C:\\Users\\aleja\\Desktop\\Proyectos\\CampamentoPuntos\\backend-puntos\\functions\\api\\points.js"
import { onRequestGet as __api_teams_js_onRequestGet } from "C:\\Users\\aleja\\Desktop\\Proyectos\\CampamentoPuntos\\backend-puntos\\functions\\api\\teams.js"
import { onRequestPost as __api_teams_js_onRequestPost } from "C:\\Users\\aleja\\Desktop\\Proyectos\\CampamentoPuntos\\backend-puntos\\functions\\api\\teams.js"

export const routes = [
    {
      routePath: "/api/teams/:id",
      mountPath: "/api/teams",
      method: "DELETE",
      middlewares: [],
      modules: [__api_teams__id__js_onRequestDelete],
    },
  {
      routePath: "/api/login",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_login_js_onRequestOptions],
    },
  {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_js_onRequestPost],
    },
  {
      routePath: "/api/logs",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_logs_js_onRequestGet],
    },
  {
      routePath: "/api/points",
      mountPath: "/api",
      method: "PATCH",
      middlewares: [],
      modules: [__api_points_js_onRequestPatch],
    },
  {
      routePath: "/api/teams",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_teams_js_onRequestGet],
    },
  {
      routePath: "/api/teams",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_teams_js_onRequestPost],
    },
  ]