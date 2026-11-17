// El Ávila en 3D: relieve real (public/hero/avila-dem.png, ver scripts/build-avila-dem.mjs),
// visto desde Caracas hacia el norte. Todo depende de la hora de Caracas (UTC−4), que el
// visitante puede cambiar:
//   · cielo (shader propio): degradado, brillo del crepúsculo, nubes finas, estrellas y luna con su fase real
//   · montaña: bosque, roca y pasto de altura, micro-relieve y sombras proyectadas por las propias crestas
//   · mar de nubes: capa base más dos velos que se mueven con distinta velocidad
//   · vida: la cámara rota despacio, las nubes proyectan sombras sobre las laderas, jirones de niebla suben
//     por ellas, rayos de luz al amanecer y atardecer, pájaros de día, estrellas fugaces y las luces reales
//     del hotel Humboldt y del teleférico de noche
// Hay dos lienzos WebGL: el cielo va detrás del nombre (texto del DOM) y la montaña, delante,
// así la cresta tapa de verdad al nombre.
import {
  BufferAttribute, BufferGeometry, ClampToEdgeWrapping, DataTexture, DataUtils, DoubleSide, HalfFloatType,
  LinearFilter, Mesh, PerspectiveCamera, PlaneGeometry, RedFormat, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer,
} from "three";

// Mismo recuadro que scripts/build-avila-dem.mjs
const BOUNDS = { west: -67.0, east: -66.72, south: 10.475, north: 10.625 };
const UTC_OFFSET = -4; // Caracas
const KM_LAT = 110.57;
const KM_LON = 111.32 * Math.cos((10.55 * Math.PI) / 180);
const WIDTH_KM = (BOUNDS.east - BOUNDS.west) * KM_LON;
const DEPTH_KM = (BOUNDS.north - BOUNDS.south) * KM_LAT;
const EXAG = 1.7; // exageración vertical: de lejos, el relieve real se ve plano
const CLOUD_Y = 1.3 * EXAG; // techo del mar de nubes (≈1.300 m)
/** lon/lat → km sobre el modelo (x hacia el este, z hacia el sur; el norte queda al fondo) */
const toWorld = (lon: number, lat: number) =>
  new Vector2(((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west) - 0.5) * WIDTH_KM, ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south) - 0.5) * DEPTH_KM);
// Puntos reales (aproximados): hotel Humboldt, en la cumbre, y la estación Maripérez, abajo
const HOTEL = toWorld(-66.8767, 10.5417);
const MARIPEREZ = toWorld(-66.8853, 10.5106);
const LAYERS = [
  { y: -0.6, alpha: 1, scale: 1, seed: 0 }, // suelo opaco
  { y: -0.12, alpha: 0.8, scale: 1.25, seed: 1 }, // velos translúcidos
  { y: 0.26, alpha: 0.62, scale: 0.8, seed: 2 },
];

const rad = Math.PI / 180;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Altura y azimut del sol (radianes; azimut desde el norte hacia el este). Precisión de ~1°. */
export function sunPosition(date: Date, lat = 10.5, lon = -66.9) {
  const d = date.getTime() / 864e5 - 10957.5; // días desde J2000
  const g = (357.529 + 0.98560028 * d) * rad;
  const L = (280.459 + 0.98564736 * d + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
  const e = 23.439 * rad;
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = 18.697374558 + 24.06570982441908 * d; // horas
  const ha = (gmst * 15 + lon) * rad - ra;
  const la = lat * rad;
  return {
    alt: Math.asin(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(ha)),
    az: Math.atan2(-Math.sin(ha), Math.tan(dec) * Math.cos(la) - Math.sin(la) * Math.cos(ha)),
  };
}

/** Edad de la luna como fracción del ciclo: 0 = nueva, 0,5 = llena */
export function moonAge(date: Date) {
  const jd = date.getTime() / 864e5 + 2440587.5;
  return (((jd - 2451550.1) / 29.530588853) % 1 + 1) % 1;
}

// ---------------------------------------------------------------------------------------------
// Atmósfera por altura del sol (grados). Los colores están en sRGB; los del 3D se pasan a lineal.
type Stop = {
  alt: number; zenith: string; mid: string; horizon: string; glow: string; glowI: number;
  sun: string; sunI: number; ambTop: string; ambBot: string; cloud: string;
};
const STOPS: Stop[] = [
  { alt: -18, zenith: "#02030a", mid: "#050919", horizon: "#0f1738", glow: "#1b2a60", glowI: 0, sun: "#8fa6f0", sunI: 0.95, ambTop: "#3b52a0", ambBot: "#151d3c", cloud: "#202a52" },
  { alt: -8, zenith: "#070b24", mid: "#1d1b4a", horizon: "#4c4079", glow: "#8a56a0", glowI: 0.5, sun: "#9a8ce0", sunI: 0.7, ambTop: "#474a92", ambBot: "#1f1a3c", cloud: "#433a70" },
  { alt: -2, zenith: "#141b48", mid: "#52427c", horizon: "#e08c88", glow: "#ff9a78", glowI: 0.95, sun: "#ffa27c", sunI: 0.85, ambTop: "#51558c", ambBot: "#30243c", cloud: "#a57d94" },
  { alt: 4, zenith: "#26376e", mid: "#7f7cab", horizon: "#f7b88c", glow: "#ffc48c", glowI: 1, sun: "#ffc08c", sunI: 1.15, ambTop: "#8292c4", ambBot: "#54424a", cloud: "#dcae9f" },
  { alt: 13, zenith: "#2a4d8c", mid: "#7ba2cf", horizon: "#f0d3bb", glow: "#ffe2bc", glowI: 0.55, sun: "#ffe0bb", sunI: 1.2, ambTop: "#7ca3d0", ambBot: "#5d5b57", cloud: "#ead9d2" },
  { alt: 30, zenith: "#2060b2", mid: "#6aa4e2", horizon: "#b2d2ee", glow: "#fff2d8", glowI: 0.2, sun: "#fff3dc", sunI: 1.3, ambTop: "#80b3ec", ambBot: "#6a6f62", cloud: "#f2f5fa" },
  { alt: 60, zenith: "#1a56ae", mid: "#5698dc", horizon: "#a8cbec", glow: "#fff8ea", glowI: 0.08, sun: "#fffaf0", sunI: 1.35, ambTop: "#88b8ee", ambBot: "#70745f", cloud: "#f6f8fc" },
];
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c: number[]) => c.map((v) => v ** 2.2);

function atmosphere(altDeg: number) {
  let i = 0;
  while (i < STOPS.length - 2 && altDeg > STOPS[i + 1].alt) i++;
  const a = STOPS[i], b = STOPS[i + 1];
  const t = smooth(a.alt, b.alt, altDeg);
  const mix = (k: "zenith" | "mid" | "horizon" | "glow" | "sun" | "ambTop" | "ambBot" | "cloud") => rgb(a[k]).map((v, j) => v + (rgb(b[k])[j] - v) * t);
  return {
    zenith: mix("zenith"), mid: mix("mid"), horizon: mix("horizon"), glow: mix("glow"), sun: mix("sun"),
    ambTop: mix("ambTop"), ambBot: mix("ambBot"), cloud: mix("cloud"),
    glowI: a.glowI + (b.glowI - a.glowI) * t,
    sunI: a.sunI + (b.sunI - a.sunI) * t,
  };
}

// ---------------------------------------------------------------------------------------------
async function loadHeights(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar el relieve (${res.status})`);
  // Sin conversión de color: los bytes del PNG son datos, no una imagen
  const bitmap = await createImageBitmap(await res.blob(), { colorSpaceConversion: "none", premultiplyAlpha: "none" });
  const { width, height } = bitmap;
  const cv = document.createElement("canvas");
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0);
  const px = ctx.getImageData(0, 0, width, height).data;
  const meters = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      // El recorte termina de golpe al este y al oeste: ahí el relieve se hunde en las nubes
      const u = x / (width - 1);
      meters[i] = (px[i * 4] * 256 + px[i * 4 + 1]) * smooth(0, 0.1, u) * smooth(1, 0.9, u);
    }
  }
  return { width, height, meters };
}

function buildTerrain({ width, height, meters }: { width: number; height: number; meters: Float32Array }) {
  const pos = new Float32Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      pos[i * 3] = (x / (width - 1) - 0.5) * WIDTH_KM;
      pos[i * 3 + 1] = (meters[i] / 1000) * EXAG;
      pos[i * 3 + 2] = (y / (height - 1) - 0.5) * DEPTH_KM; // fila 0 = norte
    }
  }
  const index = new Uint32Array((width - 1) * (height - 1) * 6);
  let k = 0;
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const a = y * width + x, b = a + 1, c = a + width, d = c + 1;
      index[k++] = a; index[k++] = c; index[k++] = b;
      index[k++] = b; index[k++] = c; index[k++] = d;
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(pos, 3));
  geo.setAttribute("aH", new BufferAttribute(meters, 1));
  geo.setIndex(new BufferAttribute(index, 1));
  geo.computeVertexNormals();
  return geo;
}

/** Alturas en una textura de media precisión (filtrado lineal sin extensiones): el shader la usa para las sombras */
function heightTexture({ width, height, meters }: { width: number; height: number; meters: Float32Array }) {
  const half = new Uint16Array(meters.length);
  for (let i = 0; i < half.length; i++) half[i] = DataUtils.toHalfFloat(meters[i]);
  const tex = new DataTexture(half, width, height, RedFormat, HalfFloatType);
  tex.minFilter = tex.magFilter = LinearFilter;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

// ---------------------------------------------------------------------------------------------
// Shaders. El 3D se ilumina en espacio lineal y se convierte a sRGB al final; el cielo, directo en sRGB.
const COMMON = /* glsl */ `
  uniform float uTime;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 hash2(vec2 p) { return vec2(hash(p), hash(p + 37.7)); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
    return v;
  }
  float fbm3(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
    return v;
  }
  vec3 toSRGB(vec3 c) { return pow(max(c, vec3(0.0)), vec3(1.0 / 2.2)); }
  float dither(vec2 fc) { return (hash(fc + fract(uTime)) - 0.5) / 255.0; }
`;

// Nubes y bruma, compartidas por la montaña y las capas de nubes (lineal)
const ATMOS = /* glsl */ `
  uniform vec3 uCloud;
  uniform vec3 uFog;
  uniform vec3 uSun;
  uniform vec3 uSunCol;
  uniform float uCity;
  varying vec3 vWorld;
  // Volumen aparente: el mismo ruido, un poco desplazado hacia el sol, hace de luz
  vec3 cloudColor(vec2 xz) {
    vec2 drift = vec2(uTime * 0.014, uTime * 0.005);
    float n = fbm(xz * 0.15 + drift);
    float lit = fbm3((xz + uSun.xz * 1.3) * 0.15 + drift);
    float relief = n - lit;
    // De noche las nubes, que están justo sobre Caracas, se iluminan desde abajo con la ciudad
    vec3 city = vec3(0.34, 0.15, 0.045) * uCity * (0.45 + 0.9 * n);
    return uCloud * (0.7 + 0.5 * n + 1.0 * relief) + uSunCol * max(relief, 0.0) * 0.6 + city;
  }
  float haze(float d) { return 1.0 - exp(-pow(d / 36.0, 1.5)); }
`;

const TERRAIN_VERT = /* glsl */ `
  attribute float aH;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;
  void main() {
    vWorld = position;
    vNormal = normal;
    vH = aH;
    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
  }
`;

const TERRAIN_FRAG = /* glsl */ `
  ${COMMON}
  ${ATMOS}
  uniform vec3 uAmbTop;
  uniform vec3 uAmbBot;
  uniform float uLines;
  uniform float uCloudY;
  uniform float uExag;
  uniform int uShadowSteps;
  uniform float uCloudShadow;
  uniform float uLights;
  uniform vec2 uHotel;
  uniform vec2 uLiftA;
  uniform vec2 uExtent;
  uniform sampler2D uHeightTex;
  varying vec3 vNormal;
  varying float vH;

  float terrainY(vec2 xz) {
    vec2 uv = xz / uExtent + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return -1.0;
    return texture2D(uHeightTex, uv).r * 0.001 * uExag;
  }

  // Sombra suave proyectada por el propio relieve: se camina el rayo hacia el sol
  float castShadow(vec3 p, vec3 L) {
    float res = 1.0;
    float t = 0.06;
    for (int i = 0; i < 32; i++) {
      if (i >= uShadowSteps) break;
      vec3 q = p + L * t;
      float h = terrainY(q.xz);
      if (h < 0.0) break;
      res = min(res, 14.0 * (q.y - h + 0.015) / t);
      if (res <= 0.0) break;
      t += max(0.05, t * 0.12);
    }
    return clamp(res, 0.0, 1.0);
  }

  void main() {
    vec3 n0 = normalize(vNormal);
    vec3 toCam = cameraPosition - vWorld;
    float dist = length(toCam);
    vec3 V = toCam / dist;
    vec2 p = vWorld.xz;

    // Micro-relieve: el modelo tiene un punto cada ~60 m, el bosque y la roca lo rompen
    float near = 1.0 - smoothstep(16.0, 36.0, dist);
    float b0 = fbm3(p * 22.0);
    vec2 g = vec2(fbm3(p * 22.0 + vec2(0.4, 0.0)) - b0, fbm3(p * 22.0 + vec2(0.0, 0.4)) - b0);
    vec3 n = normalize(n0 + vec3(g.x, 0.0, g.y) * 1.6 * near);

    // Albedo (lineal): bosque nublado, pie de monte seco, pasto de altura y roca en las paredes
    float slope = 1.0 - n0.y;
    float patches = fbm3(p * 4.0);
    float grain = fbm3(p * 34.0);
    vec3 forestDark = vec3(0.020, 0.062, 0.026);
    vec3 forestLit = vec3(0.075, 0.170, 0.045);
    vec3 dryLow = vec3(0.115, 0.118, 0.050);
    vec3 alpine = vec3(0.170, 0.150, 0.060);
    vec3 rock = vec3(0.125, 0.105, 0.095);
    vec3 alb = mix(forestDark, forestLit, smoothstep(0.25, 0.8, patches * 0.6 + grain * 0.6));
    alb = mix(dryLow, alb, smoothstep(1000.0, 1500.0, vH));
    alb = mix(alb, alpine, smoothstep(2000.0, 2500.0, vH) * (0.4 + 0.6 * patches));
    alb = mix(alb, rock, smoothstep(0.36, 0.62, slope + (grain - 0.5) * 0.3));
    alb *= 0.72 + 0.56 * grain;

    // Luz: sol (o luna) con sombras, más cielo y rebote del suelo
    float ndl = dot(n, uSun);
    float sh = castShadow(vWorld + n0 * 0.012, uSun);
    // Sombras de las nubes: manchas que cruzan la montaña empujadas por el viento
    float cs = smoothstep(0.44, 0.66, fbm3(p * 0.085 + vec2(uTime * 0.04, uTime * 0.016)));
    float shade = 1.0 - 0.78 * cs * uCloudShadow;
    float direct = max(ndl, 0.0) * mix(0.12, 1.0, sh) * shade;
    vec3 amb = mix(uAmbBot, uAmbTop, n.y * 0.5 + 0.5) * (1.0 - 0.3 * cs * uCloudShadow);
    // Relleno desde el oeste, siempre: con el sol alto o a la espalda la montaña se vería plana
    float fill = max(dot(n, normalize(vec3(-0.85, 0.45, 0.25))), 0.0);
    vec3 col = alb * (uSunCol * direct + amb + uSunCol * fill * 0.34 * (0.4 + 0.6 * sh));
    // Filo de luz en las crestas, de cara al sol
    col += uSunCol * pow(1.0 - max(dot(n, V), 0.0), 3.0) * sh * 0.05;

    // Curvas de nivel maestras (cada 500 m): firma de cartografía, muy tenues
    float w = fwidth(vH / 500.0);
    float line = (1.0 - smoothstep(0.0, 1.6 * w, abs(fract(vH / 500.0 - 0.5) - 0.5))) * (1.0 - smoothstep(0.22, 0.7, w));
    col *= 1.0 + line * uLines * 0.45;

    // Luces de noche: el hotel Humboldt y la línea del teleférico, de Maripérez a la cumbre
    if (uLights > 0.01) {
      float dh = distance(p, uHotel);
      vec3 warm = vec3(1.0, 0.62, 0.28);
      col += warm * uLights * (2.4 * exp(-dh * dh / 0.006) + 0.5 * exp(-dh * dh / 0.09));
      for (int k = 0; k < 9; k++) {
        vec2 q = mix(uLiftA, uHotel, (float(k) + 0.5) / 9.0);
        float d = distance(p, q);
        float pulse = 0.65 + 0.35 * sin(uTime * 1.6 + float(k) * 1.7);
        col += vec3(1.0, 0.8, 0.5) * uLights * pulse * (1.1 * exp(-d * d / 0.0035) + 0.25 * exp(-d * d / 0.03));
      }
    }

    // Jirones de niebla que suben por las laderas entre 1.200 y 2.200 m
    float mh = smoothstep(1150.0, 1500.0, vH) * (1.0 - smoothstep(1700.0, 2300.0, vH));
    if (mh > 0.01) {
      float mist = smoothstep(0.5, 0.82, fbm(p * 0.32 + vec2(uTime * 0.02, -uTime * 0.014)));
      col = mix(col, cloudColor(p), mist * mh * 0.6);
    }

    // La montaña sale del mar de nubes: el borde sube y baja con el ruido, como jirones
    float top = uCloudY + (fbm(p * 0.6 + uTime * 0.012) - 0.5) * 0.9;
    float cm = smoothstep(top + 0.1, top - 0.14, vWorld.y);
    if (cm > 0.001) col = mix(col, cloudColor(p), cm);

    // Perspectiva atmosférica: el aire pesa más abajo (valles brumosos) que en las cumbres
    float hz = haze(dist) * mix(1.25, 0.72, smoothstep(1100.0, 2400.0, vH));
    col = mix(col, uFog, clamp(hz, 0.0, 1.0));
    gl_FragColor = vec4(toSRGB(col) + dither(gl_FragCoord.xy), 1.0);
  }
`;

const CLOUD_VERT = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  }
`;

const CLOUD_FRAG = /* glsl */ `
  ${COMMON}
  ${ATMOS}
  uniform float uSeed;
  uniform float uScale;
  uniform float uAlpha;
  uniform float uSolid;
  void main() {
    float dist = distance(vWorld, cameraPosition);
    vec2 xz = vWorld.xz + vec2(uSeed * 7.3, uSeed * 3.1);
    vec3 col = cloudColor(xz * uScale);
    col = mix(col, uFog, haze(dist));
    float a = 1.0;
    if (uSolid < 0.5) {
      float d = fbm(xz * 0.2 * uScale + vec2(uTime * 0.02 * (1.0 + uSeed), uTime * 0.006));
      a = smoothstep(0.5, 0.74, d) * uAlpha * smoothstep(5.0, 15.0, dist);
      col *= 1.08;
    }
    gl_FragColor = vec4(toSRGB(col) + dither(gl_FragCoord.xy), a);
  }
`;

const SKY_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  ${COMMON}
  uniform vec3 uZenith;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform vec3 uCloudS;
  uniform float uGlowI;
  uniform float uSide;
  uniform float uNight;
  uniform float uHorizonY;
  uniform float uAspect;
  uniform float uPhase;
  uniform vec2 uMoon;
  varying vec2 vUv;

  void main() {
    float h = max(vUv.y - uHorizonY, 0.0) / max(1.0 - uHorizonY, 0.05);
    float x = (vUv.x * 2.0 - 1.0) * uAspect;

    // Degradado: del horizonte al cénit
    vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.42, pow(h, 0.8)));
    col = mix(col, uZenith, smoothstep(0.3, 1.0, h));

    // Resplandor del sol (o de su rastro): al este por la mañana, al oeste por la tarde
    float glow = exp(-pow((x - uSide * 1.2) / 0.95, 2.0)) * exp(-h * 2.6);
    col += uGlow * uGlowI * (glow * 0.9 + 0.25 * exp(-h * 5.0));

    // Estrellas: celdas con una estrella al azar y parpadeo
    if (uNight > 0.01) {
      vec2 sp = vec2(x, vUv.y) * 70.0;
      vec2 id = floor(sp);
      vec2 f = fract(sp) - 0.5;
      vec2 o = (hash2(id) - 0.5) * 0.7;
      float r = hash(id + 11.3);
      float size = r > 0.985 ? 0.2 : 0.09;
      float tw = 0.65 + 0.35 * sin(uTime * (1.0 + r * 3.0) + r * 40.0);
      float star = smoothstep(size, 0.0, length(f - o)) * step(0.94, r) * tw;
      col += vec3(0.85, 0.9, 1.0) * star * uNight * smoothstep(0.02, 0.35, h);
    }

    // Nubes altas: bandas finas que se pierden hacia el horizonte
    float depth = 1.0 / (h * 1.3 + 0.12);
    vec2 cp = vec2(x * depth * 0.55 + uTime * 0.012, depth + uTime * 0.004);
    float c = fbm(cp * vec2(1.1, 2.6));
    float cm = smoothstep(0.52, 0.86, c) * smoothstep(0.0, 0.1, h) * (1.0 - smoothstep(0.55, 1.0, h) * 0.65);
    vec3 cc = mix(uCloudS * 0.62, mix(uCloudS, uGlow, 0.55 * uGlowI), 0.5 + 0.5 * glow);
    col = mix(col, cc, cm * 0.5);

    // Luna con su fase del día
    if (uNight > 0.01) {
      vec2 q = (vUv - uMoon) * vec2(uAspect, 1.0) / 0.034;
      float r2 = dot(q, q);
      float halo = exp(-r2 * 0.012) * 0.16 * uNight;
      col += vec3(0.6, 0.68, 1.0) * halo;
      if (r2 < 1.0) {
        vec3 nrm = vec3(q, sqrt(1.0 - r2));
        float ph = uPhase * 6.2831853;
        vec3 L = vec3(sin(ph), 0.0, -cos(ph));
        float lit = smoothstep(-0.04, 0.08, dot(nrm, L));
        float maria = 0.8 + 0.3 * fbm3(q * 2.2 + 4.0);
        vec3 moon = vec3(0.93, 0.94, 0.88) * maria;
        float edge = smoothstep(1.0, 0.94, sqrt(r2));
        // La parte iluminada tapa el cielo; la oscura solo lo vela (luz cenicienta)
        col = mix(col, moon, edge * lit * uNight);
        col = mix(col, col * 0.7 + vec3(0.025, 0.035, 0.07), edge * (1.0 - lit) * uNight);
      }
    }

    gl_FragColor = vec4(col + dither(gl_FragCoord.xy), 1.0);
  }
`;

// Capa final a pantalla completa: rayos de luz, pájaros, estrella fugaz y viñeta
const FX_FRAG = /* glsl */ `
  ${COMMON}
  uniform float uAspect;
  uniform float uDay;
  uniform float uNight;
  uniform float uRay;
  uniform float uSide;
  uniform float uHorizonY;
  uniform float uBirds;
  uniform vec3 uSunS;
  varying vec2 vUv;

  float seg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
  }

  // Un pájaro lejano: dos alas en "M" que aletean
  float bird(vec2 uv, float i) {
    float r1 = hash(vec2(i, 1.3)), r2 = hash(vec2(i, 7.1)), r3 = hash(vec2(i, 3.7));
    float dir = r2 > 0.5 ? 1.0 : -1.0;
    float x = -0.1 + 1.2 * fract(r3 + uTime * (0.018 + r1 * 0.02) * dir / 1.2);
    float y = 0.5 + r2 * 0.28 + 0.014 * sin(uTime * 0.6 + r1 * 6.28) + (x - 0.5) * 0.04 * (r1 - 0.5);
    float s = 0.0055 + r3 * 0.006;
    vec2 q = (uv - vec2(x, y)) * vec2(uAspect, 1.0) / s;
    q.x = abs(q.x);
    float f = 0.5 + 0.5 * sin(uTime * (5.5 + r1 * 3.0) + r2 * 6.28); // 0 = alas abajo, 1 = arriba
    vec2 tip = vec2(1.3, 0.25 + 0.55 * f);
    float d = min(seg(q, vec2(0.0), tip), seg(q, tip, vec2(2.4, -0.05 + 0.4 * f)));
    return smoothstep(0.22, 0.09, d);
  }

  void main() {
    vec2 uv = vUv;
    vec3 rgb = vec3(0.0);
    float a = 0.0;

    // Rayos de luz: salen de donde está el sol (fuera de cuadro) al amanecer y al atardecer
    if (uRay > 0.01) {
      vec2 c = vec2(0.5 + uSide * 0.78, uHorizonY + 0.1);
      vec2 v = (uv - c) * vec2(uAspect, 1.0);
      float ang = atan(v.y, v.x);
      float rays = noise(vec2(ang * 8.0, uTime * 0.035)) * 0.6 + noise(vec2(ang * 21.0 + 3.0, -uTime * 0.025)) * 0.4;
      float ra = pow(rays, 2.4) * exp(-length(v) * 1.05) * uRay * smoothstep(-0.25, 0.1, v.y) * 0.24;
      rgb += uSunS * ra;
      a += ra;
    }

    // Estrella fugaz, de vez en cuando
    if (uNight > 0.5) {
      float k = uTime / 8.0;
      float id = floor(k), f = fract(k);
      if (hash(vec2(id, 5.5)) > 0.4 && f < 0.07) {
        float u = f / 0.07;
        vec2 dir = normalize(vec2(0.85, -0.5));
        vec2 head = vec2(0.12 + 0.7 * hash(vec2(id, 1.0)), 0.78 + 0.17 * hash(vec2(id, 2.0))) + dir * u * 0.3;
        vec2 q = (uv - head) * vec2(uAspect, 1.0);
        vec2 dd = dir * vec2(uAspect, 1.0);
        float along = dot(q, -normalize(dd));
        float across = length(q + normalize(dd) * along);
        float tail = smoothstep(0.0, 0.12, along) * (1.0 - smoothstep(0.12, 0.2, along));
        float sa = smoothstep(0.004, 0.0008, across) * clamp(1.0 - along * 7.0, 0.0, 1.0) * step(0.0, along) * (1.0 - u * 0.6);
        rgb += vec3(0.9, 0.95, 1.0) * sa;
        a += sa;
      }
    }

    // Pájaros, solo de día
    if (uDay > 0.05) {
      float b = 0.0;
      for (int i = 0; i < 6; i++) { if (float(i) < uBirds) b = max(b, bird(uv, float(i))); }
      float ba = b * uDay * 0.8;
      vec3 bc = mix(vec3(0.08, 0.04, 0.07), vec3(0.04, 0.05, 0.09), smoothstep(0.1, 0.8, uDay));
      rgb = mix(rgb, bc, ba);
      a = max(a, ba);
    }

    // Viñeta: concentra la mirada y ancla el texto
    float vig = smoothstep(0.5, 1.08, length((uv - 0.5) * vec2(1.05, 1.0)));
    vec3 vc = vec3(0.01, 0.015, 0.04);
    float va = vig * 0.34;
    rgb = (rgb * a + vc * va * (1.0 - a)) / max(a + va * (1.0 - a), 0.0001);
    a = a + va * (1.0 - a);

    gl_FragColor = vec4(rgb, clamp(a, 0.0, 1.0));
  }
`;

// ---------------------------------------------------------------------------------------------
export type AvilaSky = { night: number };
export type AvilaOptions = {
  demUrl: string;
  /** Lienzo del cielo, detrás del nombre */
  skyCanvas: HTMLCanvasElement;
  reducedMotion?: boolean;
  /** Se llama al cambiar la luz (la página lo usa para, p. ej., encender las ventanas de la cabina) */
  onSky?: (sky: AvilaSky) => void;
};

export async function createAvilaScene(canvas: HTMLCanvasElement, { demUrl, skyCanvas, reducedMotion = false, onSky }: AvilaOptions) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const skyRenderer = new WebGLRenderer({ canvas: skyCanvas, antialias: false, powerPreference: "high-performance" });

  const heights = await loadHeights(demUrl);

  const uniforms = {
    uTime: { value: 0 },
    uCloud: { value: new Vector3() },
    uFog: { value: new Vector3() },
    uSun: { value: new Vector3(0, 1, 0) },
    uSunCol: { value: new Vector3() },
    uAmbTop: { value: new Vector3() },
    uAmbBot: { value: new Vector3() },
    uLines: { value: 1 },
    uCloudY: { value: CLOUD_Y },
    uExag: { value: EXAG },
    uShadowSteps: { value: 32 },
    uCloudShadow: { value: 0 },
    uLights: { value: 0 },
    uCity: { value: 0 },
    uHotel: { value: HOTEL },
    uLiftA: { value: MARIPEREZ },
    uExtent: { value: new Vector2(WIDTH_KM, DEPTH_KM) },
    uHeightTex: { value: heightTexture(heights) },
  };

  const scene = new Scene();
  const terrain = new Mesh(buildTerrain(heights), new ShaderMaterial({ uniforms, vertexShader: TERRAIN_VERT, fragmentShader: TERRAIN_FRAG }));
  terrain.frustumCulled = false;
  scene.add(terrain);

  const layers = LAYERS.map((l, i) => {
    const mat = new ShaderMaterial({
      uniforms: { ...uniforms, uSeed: { value: l.seed }, uScale: { value: l.scale }, uAlpha: { value: l.alpha }, uSolid: { value: i === 0 ? 1 : 0 } },
      vertexShader: CLOUD_VERT,
      fragmentShader: CLOUD_FRAG,
      transparent: i > 0,
      depthWrite: i === 0,
      side: DoubleSide,
    });
    const mesh = new Mesh(new PlaneGeometry(900, 900), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = CLOUD_Y + l.y;
    mesh.renderOrder = i;
    scene.add(mesh);
    return mesh;
  });

  const skyU = {
    uTime: uniforms.uTime,
    uZenith: { value: new Vector3() },
    uMid: { value: new Vector3() },
    uHorizon: { value: new Vector3() },
    uGlow: { value: new Vector3() },
    uCloudS: { value: new Vector3() },
    uGlowI: { value: 0 },
    uSide: { value: 0 },
    uNight: { value: 0 },
    uHorizonY: { value: 0.5 },
    uAspect: { value: 1.6 },
    uPhase: { value: 0.25 },
    uMoon: { value: new Vector2(0.72, 0.8) },
  };
  const skyScene = new Scene();
  const skyQuad = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({ uniforms: skyU, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, depthTest: false, depthWrite: false }));
  skyQuad.frustumCulled = false;
  skyScene.add(skyQuad);
  const skyCamera = new PerspectiveCamera();

  // Capa final (rayos, pájaros, viñeta) sobre el 3D
  const fxU = {
    uTime: uniforms.uTime,
    uAspect: skyU.uAspect,
    uDay: { value: 0 },
    uNight: skyU.uNight,
    uRay: { value: 0 },
    uSide: skyU.uSide,
    uHorizonY: skyU.uHorizonY,
    uBirds: { value: 6 },
    uSunS: { value: new Vector3(1, 0.85, 0.65) },
  };
  const fx = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({ uniforms: fxU, vertexShader: SKY_VERT, fragmentShader: FX_FRAG, transparent: true, depthTest: false, depthWrite: false }));
  fx.frustumCulled = false;
  fx.renderOrder = 100;
  scene.add(fx);

  const camera = new PerspectiveCamera(34, 1, 0.1, 700);
  const target = new Vector3();
  const far = new Vector3();

  // --- Hora: en vivo (hora real de Caracas) o fijada por el visitante, con transición suave ---
  const caracasHour = (d = new Date()) => {
    const c = new Date(d.getTime() + UTC_OFFSET * 36e5);
    return c.getUTCHours() + c.getUTCMinutes() / 60 + c.getUTCSeconds() / 3600;
  };
  const dateAt = (h: number) => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return new Date(d.getTime() + (h - UTC_OFFSET) * 36e5);
  };
  let fixedHour: number | null = null; // null = en vivo
  let shown = caracasHour(); // hora que se está pintando
  let tween: { from: number; delta: number; t: number } | null = null;

  let scroll = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let intro = reducedMotion ? 1 : 0;
  let raf = 0;
  let running = false;
  let last = 0;
  let lastNight = -1;
  let quality = 0;
  let ema = 16;
  let warm = 0;

  const applyLight = () => {
    const date = fixedHour === null && !tween ? new Date() : dateAt(shown);
    const sun = sunPosition(date);
    const alt = sun.alt / rad;
    const A = atmosphere(alt);
    const night = smooth(-5, -12, alt);

    // Dirección de la luz: el sol (nunca por debajo de 9° para que el relieve siga modelado y no quede todo en sombra) o una luna fija
    const dir = (a: number, az: number) => new Vector3(Math.cos(a) * Math.sin(az), Math.sin(a), -Math.cos(a) * Math.cos(az));
    const moonMix = smooth(-1, -7, alt);
    const L = dir(Math.max(sun.alt, 9 * rad), sun.az).multiplyScalar(1 - moonMix).add(dir(38 * rad, 215 * rad).multiplyScalar(moonMix)).normalize();

    uniforms.uSun.value.copy(L);
    uniforms.uSunCol.value.fromArray(lin(A.sun.map((v) => v * A.sunI)));
    uniforms.uAmbTop.value.fromArray(lin(A.ambTop));
    uniforms.uAmbBot.value.fromArray(lin(A.ambBot));
    uniforms.uFog.value.fromArray(lin(A.horizon));
    uniforms.uCloud.value.fromArray(lin(A.cloud));

    skyU.uZenith.value.fromArray(A.zenith);
    skyU.uMid.value.fromArray(A.mid);
    skyU.uHorizon.value.fromArray(A.horizon);
    skyU.uGlow.value.fromArray(A.glow);
    skyU.uCloudS.value.fromArray(A.cloud);
    skyU.uGlowI.value = A.glowI * (1 - night);
    skyU.uSide.value = Math.sin(sun.az);
    skyU.uNight.value = night;
    skyU.uPhase.value = moonAge(date);

    uniforms.uCloudShadow.value = smooth(4, 22, alt) * (1 - night);
    uniforms.uLights.value = smooth(-3, -9, alt);
    uniforms.uCity.value = smooth(-2, -10, alt);
    fxU.uDay.value = smooth(0, 8, alt);
    fxU.uRay.value = smooth(-3, 1, alt) * (1 - smooth(14, 28, alt));
    fxU.uSunS.value.fromArray(A.sun);

    if (onSky && Math.abs(night - lastNight) > 0.01) {
      lastNight = night;
      onSky({ night });
    }
  };

  const applyCamera = () => {
    const portrait = camera.aspect < 0.9;
    const e = 1 - Math.pow(1 - intro, 3); // la cámara sube desde las nubes al entrar
    const sc = scroll;
    const t = reducedMotion ? 0 : uniforms.uTime.value;
    camera.fov = portrait ? 46 : 34;

    // Rota despacio alrededor de la montaña (±5°) y respira un poco: paralaje real entre crestas
    const swing = Math.sin(t * 0.055) * 0.075 + Math.sin(t * 0.021 + 1.3) * 0.035;
    const tx = portrait ? 1.3 : 0.6;
    const relX = (portrait ? -0.4 : -1.2) - tx;
    const relZ = 15.5 - e * 2 - sc * 5;
    const cos = Math.cos(swing), sin = Math.sin(swing);
    camera.position.set(
      tx + relX * cos + relZ * sin + pointer.x * 1.3,
      CLOUD_Y + 0.45 + e * 0.5 + sc * 2.2 + pointer.y * 0.3 + Math.sin(t * 0.09) * 0.08,
      relZ * cos - relX * sin,
    );
    target.set(tx, (portrait ? 4.15 : 4.4) + sc * 0.6, 0);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    skyU.uAspect.value = camera.aspect;
    skyU.uMoon.value.set(portrait ? 0.86 : 0.8, portrait ? 0.8 : 0.82); // en móvil, bajo la cabecera y fuera del nombre
  };

  const render = (time: number) => {
    const raw = (time - last) / 1000;
    // Nunca negativo: la marca de requestAnimationFrame puede ir por detrás de performance.now()
    const dt = Math.min(0.05, Math.max(0, raw || 0));
    last = time;
    if (!reducedMotion) {
      intro = Math.min(1, intro + dt / 2.6);
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
      uniforms.uTime.value = time / 1000;
    }
    if (tween) {
      tween.t = Math.min(1, tween.t + dt / 1.1);
      const k = 1 - Math.pow(1 - tween.t, 3);
      shown = (((tween.from + tween.delta * k) % 24) + 24) % 24;
      if (tween.t >= 1) tween = null;
    } else if (fixedHour === null) {
      shown = caracasHour();
    }
    applyLight();
    applyCamera();

    // El cielo, a su horizonte: el del suelo de nubes visto desde la cámara
    far.set(camera.position.x, layers[0].position.y, camera.position.z - 600).project(camera);
    skyU.uHorizonY.value = 0.5 + far.y / 2;

    skyRenderer.render(skyScene, skyCamera);
    renderer.render(scene, camera);

    // Calidad adaptativa: si el equipo no sostiene ~40 fps, se baja resolución, sombras y nubes
    if (running && raw > 0 && raw < 0.2) {
      warm++;
      if (warm > 8) {
        ema = ema * 0.93 + raw * 1000 * 0.07;
        if (ema > 27 && quality < 2 && warm > 60) {
          warm = 8;
          ema = 16;
          setQuality(quality + 1);
        }
      }
    }
  };

  const loop = (time: number) => {
    render(time);
    raf = requestAnimationFrame(loop);
  };

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    // 1,5× como máximo: el shader pesa por píxel y el relieve es suave, así que en retina casi no se nota
    const base = Math.min(window.devicePixelRatio || 1, 1.5);
    const ratio = [base, Math.min(base, 1), 0.75][quality];
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    skyRenderer.setPixelRatio(Math.min(base, 1.5));
    skyRenderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (!running) render(performance.now());
  }
  function setQuality(q: number) {
    quality = q;
    uniforms.uShadowSteps.value = [32, 18, 10][q];
    layers[2].visible = q < 2;
    fxU.uBirds.value = [6, 4, 2][q];
    resize();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const onPointer = (e: PointerEvent) => {
    pointer.tx = e.clientX / window.innerWidth - 0.5;
    pointer.ty = 0.5 - e.clientY / window.innerHeight;
  };
  if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", onPointer, { passive: true });
  }

  return {
    /** Arranca o detiene el bucle (p. ej. cuando el hero sale de pantalla) */
    setRunning(on: boolean) {
      if (reducedMotion || on === running) return;
      running = on;
      cancelAnimationFrame(raf);
      if (on) {
        last = Infinity; // el primer fotograma no avanza la animación
        warm = 0;
        raf = requestAnimationFrame(loop);
      }
    },
    /** Hora de Caracas (0–24). null vuelve a la hora real. `instant` salta sin transición (p. ej. al arrastrar el control) */
    setHour(h: number | null, instant = false) {
      const to = h === null ? caracasHour() : h;
      fixedHour = h;
      if (instant || reducedMotion || !running) {
        tween = null;
        shown = to;
      } else {
        const delta = ((((to - shown) % 24) + 36) % 24) - 12; // el camino corto por el reloj
        tween = { from: shown, delta, t: 0 };
      }
      if (!running) render(performance.now());
    },
    /** Progreso del scroll sobre el hero (0–1): la cámara sube y avanza hacia la montaña */
    setScroll(p: number) {
      scroll = clamp01(p);
      if (!running) render(performance.now());
    },
    renderOnce: () => render(performance.now()),
    get quality() {
      return quality;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      terrain.geometry.dispose();
      (terrain.material as ShaderMaterial).dispose();
      uniforms.uHeightTex.value.dispose();
      for (const m of layers) {
        m.geometry.dispose();
        (m.material as ShaderMaterial).dispose();
      }
      fx.geometry.dispose();
      (fx.material as ShaderMaterial).dispose();
      skyQuad.geometry.dispose();
      (skyQuad.material as ShaderMaterial).dispose();
      renderer.dispose();
      skyRenderer.dispose();
    },
  };
}
