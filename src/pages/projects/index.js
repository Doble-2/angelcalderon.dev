// NOTE: This file previously exposed an unauthenticated write endpoint under `/projects`.
// Keeping the route closed to avoid accidental public writes. If you need an admin endpoint,
// create it under `src/pages/api/*` and protect it with auth.

import { resolveLangFromRequest } from "../../lib/lang";

export const GET = async ({ request }) => {
  const lang = resolveLangFromRequest(request);
  const location = lang === "en" ? "/en#proyectos" : "/#proyectos";
  const target = new URL(location, request.url);
  return Response.redirect(target.toString(), 302);
};

export const POST = async () => {
  return new Response("Not Found", { status: 404 });
};