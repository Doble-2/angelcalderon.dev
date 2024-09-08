import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BVEgju46.mjs';
import { e as decodeKey } from './chunks/astro/server_DqBv7rMM.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/angel/Escritorio/Personal/web/angelcalderon.dev/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"projects","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects","isIndex":true,"type":"endpoint","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects/index.js","pathname":"/projects","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/angel/Escritorio/Personal/web/angelcalderon.dev/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/angel/Escritorio/Personal/web/angelcalderon.dev/src/pages/projects/[id].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/projects/[id]@_@astro":"pages/projects/_id_.astro.mjs","\u0000@astro-page:src/pages/projects/index@_@js":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","/home/angel/Escritorio/Personal/web/angelcalderon.dev/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_DNFiL1YG.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.B_st5uWx.js","/home/angel/Escritorio/Personal/web/angelcalderon.dev/node_modules/photoswipe/dist/photoswipe.esm.js":"_astro/photoswipe.esm.CKijkUPa.js","/astro/hoisted.js?q=0":"_astro/hoisted.Dfc3Jqia.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_id_.CvRwqrEO.css","/_astro/index.ChaClYii.css","/avila.jpg","/favicon.svg","/favicon_.png","/favicon_.webp","/profile.png","/profile.webp","/_astro/hoisted.B_st5uWx.js","/_astro/hoisted.Dfc3Jqia.js","/_astro/hoisted.X6JekhOX.css","/_astro/photoswipe.esm.CKijkUPa.js","/certifieds/1B03AZXP6Sxnxe6mCjnz.jpg","/certifieds/1B03AZXP6Sxnxe6mCjnz.pdf","/certifieds/AIxcYMWXAJMJ0s5meBDr.jpg","/certifieds/AIxcYMWXAJMJ0s5meBDr.pdf","/certifieds/AtMnGNTAVoQvYRn6ADZe.jpg","/certifieds/AtMnGNTAVoQvYRn6ADZe.pdf","/certifieds/Df2XZa5ZY6iAfSmhhvHU.jpg","/certifieds/Df2XZa5ZY6iAfSmhhvHU.pdf","/certifieds/IZenfRn1mFNcpM7iObWa.jpg","/certifieds/IZenfRn1mFNcpM7iObWa.pdf","/certifieds/RXHr8mDfiuogWOoQhmWU.jpg","/certifieds/RXHr8mDfiuogWOoQhmWU.pdf","/certifieds/czfwRJJJXzMjsPOXGwBt.jpg","/certifieds/czfwRJJJXzMjsPOXGwBt.pdf","/certifieds/qpcb3xBGOcDERGwVy47t.jpg","/certifieds/qpcb3xBGOcDERGwVy47t.pdf","/covers/Appod.png","/covers/Appod.webp","/covers/Born AI.png","/covers/Born AI.webp","/covers/Dona tu Vuelto.png","/covers/Dona tu Vuelto.webp","/covers/Onbox.png","/covers/Onbox.webp","/projects/Appod/apod.jpg","/projects/Appod/calendar.jpg","/projects/Appod/home.jpg","/projects/Born AI/form.jpg","/projects/Born AI/home.jpg","/projects/Born AI/init.jpg","/projects/Born AI/result.jpg","/projects/Dona tu Vuelto/cart.png","/projects/Dona tu Vuelto/finish.png","/projects/Dona tu Vuelto/select.png","/projects/Enviosfarma/home.jpg","/projects/Enviosfarma/home_mobile.jpg","/projects/Enviosfarma/main.jpg","/projects/Onbox/adopt.jpg","/projects/Onbox/home.jpg","/projects/angelcalderon.dev/footer.jpg","/projects/angelcalderon.dev/home-1.jpg","/projects/angelcalderon.dev/home.jpg","/projects/angelcalderon.dev/home_mobile-1.jpg","/projects/angelcalderon.dev/home_mobile.jpg","/projects/angelcalderon.dev/project-mobile.jpg","/projects/angelcalderon.dev/project.jpg","/projects","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"SaLWs1l46OTksbG9Qltod9qlCTAnyUWxCQF5z7b6WZU=","experimentalEnvGetSecretEnabled":false});

export { manifest };
