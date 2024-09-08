import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_C_u6mV80.mjs';
import { manifest } from './manifest_B-aZcVhQ.mjs';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/projects/_id_.astro.mjs');
const _page2 = () => import('./pages/projects.astro.mjs');
const _page3 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/projects/[id].astro", _page1],
    ["src/pages/projects/index.js", _page2],
    ["src/pages/index.astro", _page3]
]);
const serverIslandMap = new Map();

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "16d59bed-989b-4fb3-950e-9542a8e43e8d",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
