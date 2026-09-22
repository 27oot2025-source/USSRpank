// Предварительная сборка карты мира: TopoJSON -> SVG-пути + флаги + названия.
// Редакция 2077 года: СССР — единое государство, Германия разделена на ГДР и ФРГ,
// Чехословакия и Югославия существуют как единые страны, названия и флаги
// социалистического лагеря соответствуют строю.
import fs from 'node:fs';
import path from 'node:path';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath, geoCentroid, geoArea } from 'd3-geo';
import countries from 'i18n-iso-countries';
import polygonClipping from 'polygon-clipping';

const ROOT = path.resolve(import.meta.dirname, '..');
const atlas = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-110m.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/i18n-iso-countries/langs/ru.json'), 'utf8'));
countries.registerLocale(ru);

const W = 1000, H = 520;
const fc = feature(atlas, atlas.objects.countries);
const projection = geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], fc);
const pathGen = geoPath(projection);

/* ---------- вспомогательные ---------- */
const isoOf  = f => countries.numericToAlpha2(String(f.id).padStart(3, '0')) || null;
const byIso  = iso => fc.features.find(f => isoOf(f) === iso);
const byName = n => fc.features.find(f => f.properties.name === n);
const polysOf = g => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
/* d3-geo рисует сферические полигоны по направлению обхода: результат
   polygon-clipping нормируем так, чтобы полигон покрывал малую площадь сферы */
const signed = ring => {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return a / 2;
};
const fixWind = polys => polys.map(poly =>
  geoArea({ type: 'Polygon', coordinates: poly }) > Math.PI * 2
    ? poly.map(r => [...r].reverse())
    : poly);
const unionFeats = feats => ({
  type: 'MultiPolygon',
  coordinates: fixWind(polygonClipping.union(polysOf(feats[0].geometry), ...feats.slice(1).map(f => polysOf(f.geometry)))),
});
const clip = (polys, op, clipPoly) => ({
  type: 'MultiPolygon',
  coordinates: fixWind(polygonClipping[op](polys, clipPoly)),
});
const mk = (id, geometry) => ({ type: 'Feature', id, properties: { name: id }, geometry });

/* ---------- границы 2077 года ---------- */
const USSR = ['RU', 'BY', 'UA', 'MD', 'LT', 'LV', 'EE', 'GE', 'AM', 'AZ', 'KZ', 'UZ', 'TM', 'KG', 'TJ'].map(byIso);
const CSK  = ['CZ', 'SK'].map(byIso);
const YUG  = ['SI', 'HR', 'BA', 'RS', 'ME', 'MK'].map(byIso).concat(byName('Kosovo'));
const DEU  = byIso('DE');

// Приближённая граница ГДР/ФРГ (до 1990): от Балтики до чехословацкой границы
const INNER_DE = [
  [10.90, 53.96], [10.93, 53.62], [11.02, 53.28], [11.60, 53.10], [11.45, 52.90],
  [10.95, 52.62], [10.55, 52.30], [10.45, 51.95], [10.60, 51.75], [9.95, 51.35],
  [9.85, 51.05], [10.05, 50.85], [9.90, 50.65], [10.20, 50.45], [10.55, 50.40],
  [10.90, 50.40], [11.10, 50.30], [11.35, 50.35], [11.60, 50.25], [11.85, 50.30],
  [12.10, 50.32],
];
const eastRing = [...INNER_DE, [16.0, 50.32], [16.0, 54.85], [10.90, 54.85], [10.90, 53.96]];
const ddGeom = clip(polysOf(DEU.geometry), 'intersection', [eastRing]);
const deGeom = clip(polysOf(DEU.geometry), 'difference', [eastRing]);

const consumed = new Set([...USSR, ...CSK, ...YUG, DEU]);
const finalFeatures = fc.features.filter(f => !consumed.has(f)).concat([
  mk('SU', unionFeats(USSR)),
  mk('CS', unionFeats(CSK)),
  mk('YU', unionFeats(YUG)),
  mk('DD', ddGeom),
  mk('DE', deGeom),
]);

/* ---------- названия, соответствующие строю ---------- */
const NAMES = {
  SU: ['Союз Советских Социалистических Республик', 'Soviet Union'],
  DD: ['Германская Демократическая Республика', 'German Democratic Republic'],
  DE: ['Федеративная Республика Германия', 'Federal Republic of Germany'],
  CS: ['Чехословацкая Социалистическая Республика', 'Czechoslovakia'],
  YU: ['Социалистическая Федеративная Республика Югославия', 'Yugoslavia'],
  PL: ['Польская Народная Республика', 'Poland'],
  HU: ['Венгерская Народная Республика', 'Hungary'],
  RO: ['Социалистическая Республика Румыния', 'Romania'],
  BG: ['Народная Республика Болгария', 'Bulgaria'],
  AL: ['Народная Социалистическая Республика Албания', 'Albania'],
  MN: ['Монгольская Народная Республика', 'Mongolia'],
  KP: ['Корейская Народно-Демократическая Республика', 'North Korea'],
  VN: ['Социалистическая Республика Вьетнам', 'Vietnam'],
  LA: ['Лаосская Народно-Демократическая Республика', 'Laos'],
};

/* ---------- флаги социалистических держав (реконструкция) ---------- */
const HIST_FLAGS = {
  su: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><rect width="640" height="480" fill="#c00000"/><g fill="#ffd700"><polygon points="110,38 122,74 160,74 129,96 141,132 110,110 79,132 91,96 60,74 98,74"/><g transform="translate(70,130) scale(0.9)"><path d="M46 6a52 52 0 1 0 52 52" fill="none" stroke="#ffd700" stroke-width="13"/><rect x="18" y="34" width="52" height="20" transform="rotate(45 44 44)"/><rect x="36" y="46" width="14" height="62" transform="rotate(45 44 44)"/></g></g></svg>`,
  dd: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><rect width="640" height="160" fill="#000000"/><rect y="160" width="640" height="160" fill="#dd0000"/><rect y="320" width="640" height="160" fill="#ffce00"/><g fill="none" stroke="#ffce00" stroke-width="10"><circle cx="320" cy="240" r="62"/><path d="M320 196 292 282M320 196 348 282"/><path d="M282 268a62 62 0 0 0 76 0"/></g><g fill="#ffce00"><rect x="306" y="204" width="28" height="16" transform="rotate(45 320 212)"/><rect x="314" y="212" width="10" height="44" transform="rotate(45 320 212)"/></g></svg>`,
  yu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><rect width="640" height="160" fill="#003da5"/><rect y="160" width="640" height="160" fill="#ffffff"/><rect y="320" width="640" height="160" fill="#d21034"/><polygon fill="#d21034" stroke="#ffce00" stroke-width="6" points="320,180 334,222 378,222 342,248 356,290 320,264 284,290 298,248 262,222 306,222"/></svg>`,
};

/* ---------- сборка ---------- */
const FLAG_SRC = path.join(ROOT, 'node_modules/flag-icons/flags/4x3');
const FLAG_OUT = path.join(ROOT, 'assets/flags');
fs.mkdirSync(FLAG_OUT, { recursive: true });

const out = [];
let flags = 0;
for (const f of finalFeatures) {
  const iso2 = (typeof f.id === 'string' && !/^\d+$/.test(f.id)) ? f.id : isoOf(f);
  const d = pathGen(f);
  if (!d) continue;
  const named = NAMES[iso2];
  const nameRu = named ? named[0] : (iso2 ? countries.getName(iso2, 'ru') : null) || f.properties?.name || '—';
  const nameEn = named ? named[1] : f.properties?.name || '';
  const c = geoCentroid(f);
  const p = projection(c) || [0, 0];
  let flag = null;
  if (iso2) {
    const lc = iso2.toLowerCase();
    const dest = path.join(FLAG_OUT, lc + '.svg');
    if (HIST_FLAGS[lc]) {
      fs.writeFileSync(dest, HIST_FLAGS[lc]);
      flag = 'assets/flags/' + lc + '.svg'; flags++;
    } else if (lc === 'cs') {
      fs.copyFileSync(path.join(FLAG_SRC, 'cz.svg'), dest); // флаг ЧССР = флаг Чехии
      flag = 'assets/flags/' + lc + '.svg'; flags++;
    } else {
      const src = path.join(FLAG_SRC, lc + '.svg');
      if (fs.existsSync(src)) { fs.copyFileSync(src, dest); flag = 'assets/flags/' + lc + '.svg'; flags++; }
    }
  }
  out.push({
    id: f.id,
    iso2: iso2 || null,
    en: nameEn,
    ru: nameRu,
    d,
    cx: +p[0].toFixed(1),
    cy: +p[1].toFixed(1),
    lon: +c[0].toFixed(2),
    lat: +c[1].toFixed(2),
  });
}

/* убираем флаги исчезнувших с карты государств */
const keep = new Set(out.filter(c => c.iso2).map(c => c.iso2.toLowerCase()));
let pruned = 0;
for (const file of fs.readdirSync(FLAG_OUT)) {
  if (file.endsWith('.svg') && !keep.has(file.slice(0, -4))) { fs.unlinkSync(path.join(FLAG_OUT, file)); pruned++; }
}

out.sort((a, b) => a.ru.localeCompare(b.ru, 'ru'));
fs.mkdirSync(path.join(ROOT, 'assets/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets/data/world.json'), JSON.stringify({ width: W, height: H, countries: out }));

/* контроль геометрии */
const planar = polys => polys.reduce((s, p) => s + Math.abs(signed(p[0])), 0);
const share = (planar(ddGeom.coordinates) / (planar(ddGeom.coordinates) + planar(deGeom.coordinates)) * 100).toFixed(1);
console.log(`Стран: ${out.length}, флагов: ${flags}, удалено устаревших флагов: ${pruned}`);
console.log(`ГДР занимает ${share}% площади Германии (исторически ~31%)`);
console.log(`Размер: ${(fs.statSync(path.join(ROOT, 'assets/data/world.json')).size / 1024).toFixed(0)} КБ`);
