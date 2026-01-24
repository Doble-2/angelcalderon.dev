export type Lang = "es" | "en";

export function resolveLangFromRequest(request: Request, forcedLang?: unknown): Lang {
  const forced = typeof forcedLang === "string" ? forcedLang : null;
  if (forced === "es" || forced === "en") return forced;

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)lang=([^;]+)/);
  if (match) {
    try {
      const v = decodeURIComponent(match[1]);
      if (v === "es" || v === "en") return v;
    } catch {
      // ignore
    }
  }

  const accept = request.headers.get("accept-language") || "";
  if (accept.toLowerCase().startsWith("en")) return "en";
  return "es";
}
