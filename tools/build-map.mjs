// Предварительная сборка карты мира: TopoJSON -> SVG-пути + флаги + русские названия.
import fs from 'node:fs';
import path from 'node:path';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath, geoCentroid } from 'd3-geo';
import countries from 'i18n-iso-countries';

const ROOT = path.resolve(import.meta.dirname, '..');
const atlas = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/world-atlas/countries-110m.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/i18n-iso-countries/langs/ru.json'), 'utf8'));
countries.registerLocale(ru);

const W = 1000, H = 520;
const fc = feature(atlas, atlas.objects.countries);
const projection = geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], fc);
const pathGen = geoPath(projection);

const FLAG_SRC = path.join(ROOT, 'node_modules/flag-icons/flags/4x3');
const FLAG_OUT = path.join(ROOT, 'assets/flags');
fs.mkdirSync(FLAG_OUT, { recursive: true });

const out = [];
let flags = 0;
for (const f of fc.features) {
  const num = String(f.id).padStart(3, '0');
  const iso2 = countries.numericToAlpha2(num);
  const d = pathGen(f);
  if (!d) continue;
  const nameRu = iso2 ? countries.getName(iso2, 'ru') : null;
  const c = geoCentroid(f);
  const p = projection(c) || [0, 0];
  let flag = null;
  if (iso2) {
    const lc = iso2.toLowerCase();
    const src = path.join(FLAG_SRC, lc + '.svg');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(FLAG_OUT, lc + '.svg'));
      flag = 'assets/flags/' + lc + '.svg';
      flags++;
    }
  }
  out.push({
    id: f.id,
    iso2: iso2 || null,
    en: f.properties?.name || '',
    ru: nameRu || f.properties?.name || '—',
    d,
    cx: +p[0].toFixed(1),
    cy: +p[1].toFixed(1),
    lon: +c[0].toFixed(2),
    lat: +c[1].toFixed(2),
  });
}

out.sort((a, b) => a.ru.localeCompare(b.ru, 'ru'));
fs.mkdirSync(path.join(ROOT, 'assets/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets/data/world.json'), JSON.stringify({ width: W, height: H, countries: out }));
console.log(`Стран: ${out.length}, флагов: ${flags}, размер: ${(fs.statSync(path.join(ROOT,'assets/data/world.json')).size/1024).toFixed(0)} КБ`);
