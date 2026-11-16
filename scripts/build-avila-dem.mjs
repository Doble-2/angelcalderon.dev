// Genera el mapa de alturas del Ávila para el hero 3D.
//   node scripts/build-avila-dem.mjs
// Fuente: AWS Terrain Tiles (formato Terrarium, datos SRTM y otros, dominio público):
// https://registry.opendata.aws/terrain-tiles/
// Salida: public/hero/avila-dem.png — PNG RGB donde la altura en metros es R*256 + G.
// Sin dependencias: decodifica y codifica PNG con zlib.
import { inflateSync, deflateSync, crc32 } from "node:zlib";
import { writeFileSync } from "node:fs";

// Recuadro: de Caracas (sur) a la costa (norte), del Ávila occidental al Naiguatá
export const BOUNDS = { west: -67.0, east: -66.72, south: 10.475, north: 10.625 };
const ZOOM = 12;
const WIDTH = 512;
const HEIGHT = 280;
const OUT = new URL("../public/hero/avila-dem.png", import.meta.url);

const TILE = 256;
const scale = TILE * 2 ** ZOOM;
const px = (lon) => ((lon + 180) / 360) * scale;
const py = (lat) => {
  const s = Math.sin((lat * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale;
};

// PNG RGB de 8 bits sin entrelazado → Uint8Array de píxeles
function decodePng(buf) {
  let pos = 8;
  let width = 0, height = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("latin1", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 2 || data[12] !== 0) throw new Error("PNG no soportado (se espera RGB de 8 bits)");
    } else if (type === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const bpp = 3, stride = width * bpp;
  const out = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const row = y * (stride + 1) + 1;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
      let pred = 0;
      if (filter === 1) pred = a;
      else if (filter === 2) pred = b;
      else if (filter === 3) pred = (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + x] = (raw[row + x] + pred) & 255;
    }
  }
  return { width, height, data: out };
}

function encodePng(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 2; // filtro "Up": los relieves comprimen bien así
    for (let x = 0; x < stride; x++) {
      const up = y > 0 ? rgb[(y - 1) * stride + x] : 0;
      raw[y * (stride + 1) + 1 + x] = (rgb[y * stride + x] - up) & 255;
    }
  }
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
    const out = Buffer.alloc(body.length + 8);
    out.writeUInt32BE(data.length, 0);
    body.copy(out, 4);
    out.writeUInt32BE(crc32(body), body.length + 4);
    return out;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const x0 = Math.floor(px(BOUNDS.west) / TILE), x1 = Math.floor(px(BOUNDS.east) / TILE);
const y0 = Math.floor(py(BOUNDS.north) / TILE), y1 = Math.floor(py(BOUNDS.south) / TILE);

// Mosaico de alturas (metros) con todas las teselas del recuadro
const mw = (x1 - x0 + 1) * TILE, mh = (y1 - y0 + 1) * TILE;
const mosaic = new Float32Array(mw * mh);
for (let ty = y0; ty <= y1; ty++) {
  for (let tx = x0; tx <= x1; tx++) {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${ZOOM}/${tx}/${ty}.png`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const { data } = decodePng(Buffer.from(await res.arrayBuffer()));
    for (let y = 0; y < TILE; y++) {
      for (let x = 0; x < TILE; x++) {
        const i = (y * TILE + x) * 3;
        mosaic[((ty - y0) * TILE + y) * mw + (tx - x0) * TILE + x] = data[i] * 256 + data[i + 1] + data[i + 2] / 256 - 32768;
      }
    }
  }
}

const sample = (lon, lat) => {
  const fx = Math.min(mw - 1.001, Math.max(0, px(lon) - x0 * TILE - 0.5));
  const fy = Math.min(mh - 1.001, Math.max(0, py(lat) - y0 * TILE - 0.5));
  const ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy;
  const at = (x, y) => mosaic[y * mw + x];
  return (at(ix, iy) * (1 - ax) + at(ix + 1, iy) * ax) * (1 - ay) + (at(ix, iy + 1) * (1 - ax) + at(ix + 1, iy + 1) * ax) * ay;
};

const rgb = new Uint8Array(WIDTH * HEIGHT * 3);
let max = { h: -Infinity };
for (let y = 0; y < HEIGHT; y++) {
  const lat = BOUNDS.north - ((y + 0.5) / HEIGHT) * (BOUNDS.north - BOUNDS.south);
  for (let x = 0; x < WIDTH; x++) {
    const lon = BOUNDS.west + ((x + 0.5) / WIDTH) * (BOUNDS.east - BOUNDS.west);
    const h = Math.max(0, Math.round(sample(lon, lat))); // el mar queda en 0
    if (h > max.h) max = { h, lon, lat };
    rgb[(y * WIDTH + x) * 3] = h >> 8;
    rgb[(y * WIDTH + x) * 3 + 1] = h & 255;
  }
}

const png = encodePng(WIDTH, HEIGHT, rgb);
writeFileSync(OUT, png);
console.log(`avila-dem.png ${WIDTH}×${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB`);
console.log(`Punto más alto: ${max.h} m en ${max.lat.toFixed(4)}, ${max.lon.toFixed(4)}`);
for (const [name, lon, lat] of [["Hotel Humboldt / estación Ávila", -66.8767, 10.5417], ["Estación Maripérez", -66.8853, 10.5106]]) {
  console.log(`${name}: ${Math.round(sample(lon, lat))} m`);
}
