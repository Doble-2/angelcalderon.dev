// NOTE: This file previously exposed an unauthenticated write endpoint under `/projects`.
// Keeping the route closed to avoid accidental public writes. If you need an admin endpoint,
// create it under `src/pages/api/*` and protect it with auth.

export const POST = async () => {
  return new Response("Not Found", { status: 404 });
};