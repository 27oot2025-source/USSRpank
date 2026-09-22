/* =====================================================================
   КРАСНАЯ СЕТЬ / 2077 — исполняемый контур интерфейса
   ===================================================================== */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const rub = n => n.toLocaleString('ru-RU') + ' ₽';

/* Изображение с запасным вариантом, если файл ещё не сгенерирован */
const IMG = (src, alt, cls = '') =>
  `<img src="${src}" alt="${esc(alt)}" class="${cls}" loading="lazy"
    onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement('div'),{className:'imgph',textContent:'${esc(alt).slice(0,40).toUpperCase()}'}))">`;

/* --------------------------------------------------------------- */
/*  ОПИСАНИЕ ВКЛАДОК                                               */
/* --------------------------------------------------------------- */
const TABS = [
  { id:'home',     n:'Главная',        i:'01' },
  { id:'story',    n:'Мир 2077',       i:'02' },
  { id:'timeline', n:'Хроника',        i:'03' },
  { id:'chars',    n:'Личные дела',    i:'04' },
  { id:'shop',     n:'Торгсеть «Заря»',i:'05' },
  { id:'map',      n:'Карта мира',     i:'06' },
  { id:'flags',    n:'Флаги держав',   i:'07' },
  { id:'gosplan',  n:'Госплан',        i:'08' },
  { id:'tech',     n:'Технологии',     i:'09' },
  { id:'cities',   n:'Города',         i:'10' },
  { id:'news',     n:'Правда-2077',    i:'11' },
  { id:'factions', n:'Фракции',        i:'12' },
  { id:'posters',  n:'Плакаты',        i:'13' },
  { id:'life',     n:'Быт гражданина', i:'14' },
  { id:'docs',     n:'Законы',         i:'15' },
  { id:'quiz',     n:'Проверка знаний',i:'16' },
  { id:'terminal', n:'Терминал',       i:'17' },
  { id:'faq',      n:'Справка',        i:'18' },
];

/* --------------------------------------------------------------- */
/*  СТРАНИЦЫ                                                       */
/* --------------------------------------------------------------- */
const PAGE = {};

/* ===== 01. ГЛАВНАЯ ===== */
PAGE.home = () => `
<section class="hero">
  <div class="hero-bg">${IMG('assets/img/hero.jpg','Москва, 2077')}</div>
  <div class="hero-in">
    <div class="eyebrow">Общегосударственная автоматизированная система · контур «Быт-4»</div>
    <h2>Союз<em>не распался</em></h2>
    <p class="hero-lead">1965 год. Совмин принимает реформу Косыгина вместе с Общегосударственной сетью Глушкова.
      Сто двенадцать лет спустя — девятнадцать республик, 511 миллионов граждан, три внеземных поселения
      и вычислительный контур, который планирует экономику на одиннадцать лет вперёд.
      Добро пожаловать в 2077 год.</p>
    <div class="hero-cta">
      <button class="btn" data-goto="story">Что это за мир</button>
      <button class="btn ghost" data-goto="shop">Открыть торгсеть</button>
      <button class="btn ghost" data-goto="map">Карта мира</button>
    </div>
    <div class="hero-stats">
      <div><b>19</b><span>республик</span></div>
      <div><b>511,4 млн</b><span>граждан</span></div>
      <div><b>94 200</b><span>узлов Сети</span></div>
      <div><b>9,1 ЭФлопс</b><span>мощность ОГАС</span></div>
      <div><b>3</b><span>внеземных поселения</span></div>
      <div><b>160</b><span>лет Октябрю</span></div>
    </div>
  </div>
</section>

<div class="ribbon">Мир · Труд · Прогресс · Равенство · Братство · Вычисление</div>

<div class="wrap">
  <h3 class="sec-title">Оперативная сводка</h3>
  <p class="sec-sub">Данные контура обновляются каждые четыре часа. Последнее обновление — сегодня, 04:00 МСК.</p>
  <div class="grid4">${DB.kpi.slice(0,4).map(k => `
    <div class="kpi">
      <u>${esc(k.n)}</u><b>${esc(k.v)}</b>
      <i class="${k.up?'':'dn'}">${k.up?'▲':'▼'} ${esc(k.d)}</i>
      <div class="bar"><span style="width:${k.p}%"></span></div>
    </div>`).join('')}
  </div>

  <h3 class="sec-title">Разделы портала</h3>
  <p class="sec-sub">Восемнадцать информационных контуров. Доступ по гражданскому уровню допуска.</p>
  <div class="grid3">
    ${[
      ['story','Мир 2077','02','Устройство Союза, экономика, общество, повседневность и главные противоречия эпохи'],
      ['timeline','Хроника','03','Восемнадцать точек, в которых история свернула не туда, куда вы помните'],
      ['chars','Личные дела','04','Девять досье: от председателя Совета Обороны до разыскиваемой программистки'],
      ['shop','Торгсеть «Заря»','05','Двадцать позиций каталога — от нейрошлема до кибернетического кота'],
      ['map','Карта мира','06','Интерактивная карта мира образца 2077 года: единый СССР, соцлагерь, блоки влияния и флаги, соответствующие строю'],
      ['gosplan','Госплан','08','Показатели XVII пятилетки, отраслевые задания и процент выполнения'],
      ['tech','Технологии','09','Шесть столпов: Сеть, нейроинтерфейс, термояд, маглев, биосинтез, «Госплан-9»'],
      ['news','Правда-2077','11','Свежий номер главной газеты Союза — восемь материалов'],
      ['terminal','Терминал','17','Командная строка гражданского доступа. Наберите «помощь».'],
    ].map(([id,t,i,d]) => `
      <button class="tile" data-goto="${id}"><u>Раздел ${i}</u><b>${t}</b><span>${d}</span></button>
    `).join('')}
  </div>

  <h3 class="sec-title">Три спора, которые определяют эпоху</h3>
  <p class="sec-sub">Ни один из них в 2077 году не решён.</p>
  <div class="grid3">
    <div class="card pad"><div class="eyebrow">Спор первый</div>
      <h4 style="font-family:var(--f-head);font-size:19px;color:#fff;text-transform:uppercase;margin-bottom:8px">Кто принимает решение</h4>
      <p style="font-size:13px;color:var(--txt-dim)">Контуры считают 96% хозяйственных решений сами. Человек ставит подпись. Фракция «Рука» называет это ответственностью, Партия Оптимума — ритуалом, который стоит стране 7,4% роста.</p></div>
    <div class="card pad"><div class="eyebrow">Спор второй</div>
      <h4 style="font-family:var(--f-head);font-size:19px;color:#fff;text-transform:uppercase;margin-bottom:8px">Тело как средство производства</h4>
      <p style="font-size:13px;color:var(--txt-dim)">23,8% граждан аугментированы. Протез повышает выработку — значит, рано или поздно станет условием найма. Профсоюзы требуют квот, заводы требуют плана.</p></div>
    <div class="card pad"><div class="eyebrow">Спор третий</div>
      <h4 style="font-family:var(--f-head);font-size:19px;color:#fff;text-transform:uppercase;margin-bottom:8px">Непрозрачность</h4>
      <p style="font-size:13px;color:var(--txt-dim)">С 2061 года «Госплан-9» выдал 341 решение, которое не смог объяснить. 94% оказались оптимальными. Что делать с остальными шестью процентами, не знает никто.</p></div>
  </div>

  <div class="note mt"><b>Примечание.</b> Это художественный вымысел. Все организации, лица, товары и события вымышлены;
    любые совпадения с реальной историей — часть литературной игры. Флаги и очертания государств на карте — настоящие.</div>
</div>`;

/* ===== 02. МИР 2077 ===== */
PAGE.story = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 02 · Вводный курс для гражданина</div>
  <h3 class="sec-title">Мир 2077 года</h3>
  <p class="sec-sub">Краткое изложение того, как устроен Союз, почему он выжил и чем за это заплатил.</p>

  <div class="card pad" style="margin-bottom:22px">
    <p style="font-size:15px;line-height:1.8">В 1965 году Совет Министров стоял перед выбором: провести осторожную хозяйственную реформу
    или соединить её с проектом академика Глушкова — Общегосударственной автоматизированной системой учёта.
    Выбрали второе. Это решение, принятое двенадцатью голосами против девяти, отделяет знакомую вам историю от этой.</p>
    <p style="font-size:15px;line-height:1.8;margin-top:14px">Дальше всё пошло иначе. Сеть научилась считать быстрее, чем министерства успевали спорить.
    Афганской войны не случилось — модель показала цену. Чернобыль остался аварией, а не приговором.
    Августовский путч 1991-го провалился за четырнадцать часов, потому что заговорщики забыли,
    что телефонная связь теперь пишется в журнал. А потом был новый Союзный договор, электронный червонец,
    Луна, Марс, нейрошлемы и очередь на них длиной в четыре месяца.</p>
    <p style="font-size:15px;line-height:1.8;margin-top:14px">Союз 2077 года — не утопия. Это огромная, сложная, местами душная страна,
    которая решила проблему голода, но не решила проблему власти; которая построила машину,
    считающую лучше людей, и до сих пор не договорилась, кто кому подчиняется.</p>
  </div>

  <h3 class="sec-title">Устройство</h3>
  <div class="grid2">
    ${[
      ['Государство','Союз Суверенных Советских Республик, 19 республик. Верховный Совет избирается прямым сетевым голосованием с 2070 года — явка 81%. Совет Министров исполняет. Президиум — высший арбитр между людьми и контурами. Партия сохраняет руководящую роль, но с 2070-го 212 из 1500 депутатов беспартийные, и это признаётся нормой.'],
      ['Экономика','Плановая, с рыночным контуром. «Госплан-9» строит согласованный план на 11 лет и пересчитывает его каждые 4 часа. Внутри плана существует легальный частный сектор — кооперативы и сетевые артели, около 19% занятости. Валюта — безналичный расчётный рубль с машинной эмиссией. Инфляция 2077 года: 1,4%.'],
      ['Общество','511,4 млн человек, 214 национальностей, три официальных алфавита. Жильё, медицина и образование бесплатны, очередь на квартиру — год и четыре месяца. Рабочая неделя 32 часа с 2059 года. Пенсия в 62. Главное социальное расслоение проходит не по деньгам, а по уровню сетевого допуска и наличию аугментаций.'],
      ['Сеть','ОГАС: 16 отраслевых контуров, 94 200 узлов, 6 главных вычислительных центров. Это не средство общения, а нервная система хозяйства: она знает, где какая гайка и куда она поедет. Переписка, кино и «Эфир» — побочный продукт, появившийся позже.'],
      ['Космос','Лунная база «Заря» (240 человек), марсианский плацдарм «Октябрь» (11 человек, совместно с Индией), орбитальная верфь «Салют-Прогресс». 62% мировых запусков идут с Байконура. Космос перестал быть подвигом и стал отраслью со своим планом и своим невыполнением.'],
      ['Мир','Два блока и огромная середина. Атлантический блок пошёл по корпоративному пути: четыре компании контролируют 70% американской сетевой инфраструктуры. Китай построил собственную сеть, несовместимую с ОГАС. Индия — ключевой партнёр вне блоков. Финляндия торгует нейтралитетом и на этом прекрасно живёт.'],
    ].map(([t,d]) => `<div class="card pad"><h4 style="font-family:var(--f-head);font-size:18px;color:#fff;text-transform:uppercase;margin-bottom:9px;letter-spacing:.03em">${t}</h4><p style="font-size:13.4px;color:var(--txt-dim)">${d}</p></div>`).join('')}
  </div>

  <h3 class="sec-title">Чего здесь нет</h3>
  <p class="sec-sub">Честный список того, что Союз так и не смог.</p>
  <div class="grid3">
    ${[
      ['Свободы слова в полном объёме','Главлит существует. НСБ распределяет пропускную способность. Формально запретов мало, фактически «Эфир» знает, что показывать первым.'],
      ['Равного доступа к Сети','Уровень допуска определяет, что вы видите. Гражданский, служебный, особый, абсолютный. Об этом не принято говорить вслух.'],
      ['Решённого вопроса о власти','Никто не может ответить, что произойдёт, если Президиум и «Госплан-9» примут противоположные решения. Такого ещё не было. Все ждут.'],
    ].map(([t,d]) => `<div class="card pad" style="border-left:3px solid var(--red)"><h4 style="font-family:var(--f-head);font-size:16px;color:#fff;text-transform:uppercase;margin-bottom:8px">${t}</h4><p style="font-size:13px;color:var(--txt-dim)">${d}</p></div>`).join('')}
  </div>
</div>`;

/* ===== 03. ХРОНИКА ===== */
PAGE.timeline = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 03 · Государственный исторический контур</div>
  <h3 class="sec-title">Хроника расхождения</h3>
  <p class="sec-sub">Восемнадцать событий, отделяющих этот мир от того, который вы помните. 1965 — 2077.</p>
  <div class="tl">
    ${DB.timeline.map(e => `
      <div class="tl-item">
        <span class="tag red era">${esc(e.era)}</span>
        <div class="tl-year">${esc(e.y)}</div>
        <h4>${esc(e.t)}</h4>
        <p>${esc(e.d)}</p>
      </div>`).join('')}
  </div>
</div>`;

/* ===== 04. ПЕРСОНАЖИ ===== */
PAGE.chars = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 04 · Картотека граждан · допуск служебный</div>
  <h3 class="sec-title">Личные дела</h3>
  <p class="sec-sub">Девять человек, на которых держится (и от которых шатается) Союз 2077 года. Нажмите на дело для подробностей.</p>
  <div class="grid3">
    ${DB.chars.map(c => `
      <article class="per" data-char="${c.id}">
        <div class="per-ph">
          <span class="per-code">${esc(c.code)}</span>
          <span class="per-loyal">${esc(c.loyal)}</span>
          ${IMG(c.img, c.name)}
        </div>
        <div class="per-b">
          <h4>${esc(c.name)}</h4>
          <div class="per-role">${esc(c.role)}</div>
          <p>${esc(c.bio.slice(0, 190))}…</p>
          <div class="per-quote">«${esc(c.quote)}»</div>
          <div class="per-meta">${c.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </div>
      </article>`).join('')}
  </div>
</div>`;

/* ===== 05. МАГАЗИН ===== */
PAGE.shop = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 05 · Государственная торговая сеть «Заря» · 14 208 универмагов</div>
  <h3 class="sec-title">Торгсеть «Заря»</h3>
  <p class="sec-sub">Каталог бытовых, технических и кибернетических изделий. Доставка контуром «Быт» — 2 суток по Союзу, 40 суток на Луну.</p>

  <div class="shop-top">
    <input class="inp" id="q" placeholder="Поиск по каталогу…" style="flex:1">
    <select class="inp" id="sort">
      <option value="def">Порядок: по каталогу</option>
      <option value="asc">Сначала дешёвые</option>
      <option value="desc">Сначала дорогие</option>
      <option value="az">По названию</option>
    </select>
    <span class="mini" id="found"></span>
  </div>
  <div class="chips" id="chips">
    ${DB.cats.map((c, i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-cat="${c.id}">${esc(c.n)}</button>`).join('')}
  </div>
  <div class="goods" id="goods"></div>
</div>`;

/* ===== 06. КАРТА ===== */
PAGE.map = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 06 · Контур «Глобус» · политическая обстановка на 2077 год</div>
  <h3 class="sec-title">Карта мира</h3>
  <p class="sec-sub"><span id="mapcount">…</span> государств образца 2077 года: единый СССР, социалистический лагерь и прочие блоки влияния. Наведите или нажмите на страну — откроется досье и государственный флаг, соответствующий её строю. Колесо мыши — приближение, перетаскивание — сдвиг.</p>
  <div class="maplay">
    <div>
      <div class="mapbox">
        <div class="maptools">
          <button data-z="in" title="Приблизить">+</button>
          <button data-z="out" title="Отдалить">−</button>
          <button data-z="reset" title="Сброс">⟲</button>
        </div>
        <svg id="worldmap" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet"></svg>
        <div class="mapnote">проекция Эккерта · данные контура «Глобус»</div>
      </div>
      <div class="legend" id="legend"></div>
    </div>
    <div class="mapside">
      <div class="cinfo" id="cinfo"></div>
      <input class="inp" id="csearch" placeholder="Найти страну…" style="width:100%">
      <div class="clist" id="clist"></div>
    </div>
  </div>
</div>`;

/* ===== 07. ФЛАГИ ===== */
PAGE.flags = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 07 · Справочник государственных символов</div>
  <h3 class="sec-title">Флаги держав</h3>
  <p class="sec-sub">Государственные флаги держав образца 2077 года, загруженные в контур «Глобус»: для социалистического лагеря — полотнища, соответствующие строю. Нажмите на флаг — откроется досье страны на карте.</p>
  <input class="inp" id="fsearch" placeholder="Поиск по названию страны…" style="width:100%;max-width:420px;margin-bottom:18px">
  <div class="flagwall" id="flagwall"></div>
</div>`;

/* ===== 08. ГОСПЛАН ===== */
PAGE.gosplan = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 08 · Государственный плановый комитет · XVII пятилетка</div>
  <h3 class="sec-title">Госплан</h3>
  <p class="sec-sub">Сводные показатели на текущую дату. Источник — контур «Госплан-9», пересчёт каждые 4 часа.</p>

  <div class="grid4">${DB.kpi.map(k => `
    <div class="kpi">
      <u>${esc(k.n)}</u><b>${esc(k.v)}</b>
      <i class="${k.up ? '' : 'dn'}">${k.up ? '▲' : '▼'} ${esc(k.d)}</i>
      <div class="bar"><span style="width:${k.p}%"></span></div>
    </div>`).join('')}
  </div>

  <h3 class="sec-title">Отраслевые задания</h3>
  <p class="sec-sub">Исполнение годовой части плана по основным отраслям.</p>
  <div style="overflow-x:auto">
  <table class="plan">
    <thead><tr><th>Отрасль</th><th>Позиция</th><th class="num">План</th><th class="num">Факт</th><th class="num">%</th><th>Статус</th></tr></thead>
    <tbody>${DB.plan.map(r => `
      <tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="num">${esc(r[2])}</td><td class="num">${esc(r[3])}</td>
      <td class="num" style="color:${r[5] === 'вып.' ? '#3ad17c' : 'var(--amber)'}">${esc(r[4])}</td>
      <td><span class="tag ${r[5] === 'вып.' ? 'cyan' : 'amber'}">${r[5] === 'вып.' ? 'выполнено' : 'отставание'}</span></td></tr>`).join('')}
    </tbody>
  </table></div>

  <h3 class="sec-title">Заключение XI отдела</h3>
  <div class="card pad">
    <p style="font-size:14px;line-height:1.8">За отчётный период контур «Госплан-9» выдал 4 118 902 плановых решения.
    XI отдел рассмотрел в ручном порядке 1 204 из них и отменил 9. Основания отмены: в шести случаях — невозможность
    исполнения по кадровым причинам, не учтённым машиной; в двух — конфликт с региональным законодательством;
    в одном — формулировка, признанная «социально неприемлемой» при формально верном расчёте.</p>
    <p style="font-size:14px;line-height:1.8;margin-top:12px">Отдельно отмечаем хроническое отставание по жилищному строительству (91,0%).
    Контур четвёртый год подряд закладывает темпы, которые не обеспечены наличными строительными бригадами.
    На запрос об источнике этих темпов контур отвечает: «резерв трудовых ресурсов, категория Д».
    Категории Д в классификаторе не существует. Вопрос направлен в Комиссию по Непрозрачности.</p>
    <p style="font-size:13px;color:var(--amber);margin-top:14px">Ответственный секретарь XI отдела — С. А. Гуревич</p>
  </div>
  <div class="note warn mt"><b>Гриф:</b> для служебного пользования. Разглашение сводных показателей до официальной публикации — дисциплинарное взыскание.</div>
</div>`;

/* ===== 09. ТЕХНОЛОГИИ ===== */
PAGE.tech = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 09 · Государственный комитет по науке и технике</div>
  <h3 class="sec-title">Технологии Союза</h3>
  <p class="sec-sub">Шесть систем, на которых физически стоит страна.</p>
  ${DB.tech.map((t, i) => `
    <div class="card" style="margin-bottom:18px;display:grid;grid-template-columns:${i % 2 ? '1fr 340px' : '340px 1fr'};gap:0" data-tech="${i}">
      <div style="${i % 2 ? 'order:2' : ''};background:#0a0d11;min-height:220px;overflow:hidden">${IMG(t.img, t.n)}</div>
      <div style="padding:22px 24px">
        <div class="eyebrow">${esc(t.lvl)}</div>
        <h4 style="font-family:var(--f-head);font-size:22px;color:#fff;text-transform:uppercase;margin-bottom:10px;letter-spacing:.02em">${esc(t.n)}</h4>
        <p style="font-size:13.5px;color:var(--txt-dim)">${esc(t.d)}</p>
        <table class="specs">${t.f.map(f => `<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td></tr>`).join('')}</table>
      </div>
    </div>`).join('')}
  <style>@media(max-width:820px){[data-tech]{grid-template-columns:1fr !important}[data-tech]>div{order:0 !important}}</style>
</div>`;

/* ===== 10. ГОРОДА ===== */
PAGE.cities = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 10 · Контур «Быт» · городская справка</div>
  <h3 class="sec-title">Города Союза</h3>
  <p class="sec-sub">Шесть населённых пунктов, включая один внеземной.</p>
  <div class="grid2">
    ${DB.cities.map(c => `
      <article class="card" style="overflow:hidden">
        <div style="aspect-ratio:16/9;background:#0a0d11;overflow:hidden">${IMG(c.img, c.n)}</div>
        <div style="padding:18px 20px">
          <div class="eyebrow">${esc(c.s)}</div>
          <h4 style="font-family:var(--f-head);font-size:22px;color:#fff;text-transform:uppercase;margin-bottom:9px">${esc(c.n)}</h4>
          <p style="font-size:13.4px;color:var(--txt-dim)">${esc(c.d)}</p>
          <table class="specs">${c.f.map(f => `<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td></tr>`).join('')}</table>
        </div>
      </article>`).join('')}
  </div>
</div>`;

/* ===== 11. ГАЗЕТА ===== */
PAGE.news = () => {
  const d = new Date();
  const mm = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `
<div class="wrap">
  <div class="eyebrow">Раздел 11 · Орган Центрального Комитета · выходит с 1912 года</div>
  <h3 class="sec-title">Правда-2077</h3>
  <p class="sec-sub">Свежий номер. Тираж 41 млн экземпляров, из них 240 — на Луне.</p>
  <div class="paper">
    <div class="paper-h">
      <h3>ПРАВДА</h3>
      <p>№ 288 (31 402) · ${d.getDate()} ${mm[d.getMonth()]} 2077 года · Цена 5 коп. · Пролетарии всех стран, соединяйтесь!</p>
    </div>
    <div class="paper-cols">
      ${DB.news.map(n => `
        <div class="paper-art">
          <h4>${esc(n.h)}</h4>
          <p>${esc(n.t)}</p>
          <div class="by">${esc(n.by)}</div>
        </div>`).join('')}
    </div>
  </div>
</div>`;
};

/* ===== 12. ФРАКЦИИ ===== */
PAGE.factions = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 12 · Политический обзор · по данным Съезда Сетевых Советов</div>
  <h3 class="sec-title">Фракции и движения</h3>
  <p class="sec-sub">Расклад сил в Верховном Совете и за его пределами. Проценты — доля мандатов и влияния.</p>
  ${DB.factions.map(f => `
    <div class="card pad" style="margin-bottom:14px;border-left:4px solid ${f.col}">
      <div style="display:flex;align-items:baseline;gap:14px;flex-wrap:wrap">
        <h4 style="font-family:var(--f-head);font-size:21px;color:#fff;text-transform:uppercase;letter-spacing:.02em">${esc(f.n)}</h4>
        <span class="tag">${esc(f.s)}</span>
        <b style="margin-left:auto;font-family:var(--f-head);font-size:26px;color:${f.col}">${f.p}%</b>
      </div>
      <div class="bar" style="margin:10px 0 12px"><span style="width:${f.p * 2.6}%;background:${f.col}"></span></div>
      <p style="font-size:13.5px;color:var(--txt-dim)">${esc(f.d)}</p>
      <div class="per-meta">${f.m.map(m => `<span class="tag">${esc(m)}</span>`).join('')}</div>
    </div>`).join('')}
  <div class="note mt"><b>Примечание контура.</b> Сумма превышает 100%, поскольку «Отключённые» и сетевые артели не являются парламентскими фракциями — их доля отражает оценочное общественное влияние.</div>
</div>`;

/* ===== 13. ПЛАКАТЫ ===== */
PAGE.posters = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 13 · Фонд наглядной агитации · Главлит ССР</div>
  <h3 class="sec-title">Плакаты эпохи</h3>
  <p class="sec-sub">Шесть образцов агитационной графики 2062—2077 годов, включая один самиздатовский.</p>
  <div class="gal">
    ${DB.posters.map(p => `
      <figure data-poster="${esc(p.img)}" data-t="${esc(p.t)}" data-d="${esc(p.d)}">
        ${IMG(p.img, p.t)}
        <figcaption><b>${esc(p.t)}</b>${esc(p.d)}</figcaption>
      </figure>`).join('')}
  </div>
</div>`;

/* ===== 14. БЫТ ГРАЖДАНИНА ===== */
PAGE.life = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 14 · Контур «Быт» · памятка новому жителю</div>
  <h3 class="sec-title">Быт гражданина</h3>
  <p class="sec-sub">Как устроен обычный день обычного человека в Союзе 2077 года.</p>

  <div class="grid2">
    <div class="card pad">
      <h4 style="font-family:var(--f-head);font-size:19px;color:#fff;text-transform:uppercase;margin-bottom:10px">Распорядок</h4>
      <table class="specs">
        <tr><td>06:40</td><td>Подъём. Квартирный контур греет воду и включает «Эфир»</td></tr>
        <tr><td>07:20</td><td>Завтрак. Паёк или, если повезло с очередью, настоящие яйца</td></tr>
        <tr><td>07:50</td><td>Метро или маглев. Респиратор на ярусах 1—5 обязателен</td></tr>
        <tr><td>08:30</td><td>Смена. 6,4 часа при 32-часовой неделе</td></tr>
        <tr><td>15:10</td><td>Свободное время: секции, «Эфир», очередь в универмаг</td></tr>
        <tr><td>19:00</td><td>Сетевые собрания, голосования, учёба</td></tr>
        <tr><td>23:00</td><td>Отбой. Нейрошлем автоматически отключается по СанПиН</td></tr>
      </table>
    </div>
    <div class="card pad">
      <h4 style="font-family:var(--f-head);font-size:19px;color:#fff;text-transform:uppercase;margin-bottom:10px">Цены и доходы</h4>
      <table class="specs">
        <tr><td>Средняя зарплата</td><td>1 240 ₽ / мес</td></tr>
        <tr><td>Квартплата (2 комн.)</td><td>38 ₽</td></tr>
        <tr><td>Проезд, месячный</td><td>3 ₽</td></tr>
        <tr><td>Обед в столовой</td><td>по талону — 0 ₽</td></tr>
        <tr><td>Хлеб, буханка</td><td>22 коп.</td></tr>
        <tr><td>Нейрошлем «Мысль-7»</td><td>2 480 ₽ (2 зарплаты)</td></tr>
        <tr><td>Мотоцикл «Урал-Вольт»</td><td>14 700 ₽ (12 зарплат)</td></tr>
        <tr><td>Очередь на жильё</td><td>1 год 4 месяца</td></tr>
      </table>
    </div>
  </div>

  <h3 class="sec-title">Уровни допуска</h3>
  <p class="sec-sub">Главное социальное различие в Союзе проходит не по деньгам.</p>
  <div class="grid4">
    ${[
      ['Гражданский','76,2% населения','Быт, труд, медицина, учёба, «Эфир». Всё, что нужно для жизни.','var(--txt-dim)'],
      ['Служебный','18,4%','Плюс отраслевые контуры по месту работы и служебная переписка.','var(--cyan)'],
      ['Особый','5,3%','Плюс сводные данные Госплана и доступ к необъяснённым решениям.','var(--amber)'],
      ['Абсолют','0,1% (411 человек)','Всё. Включая то, о существовании чего остальные не уведомляются.','var(--red-l)'],
    ].map(([n, p, d, c]) => `
      <div class="card pad" style="border-top:3px solid ${c}">
        <h4 style="font-family:var(--f-head);font-size:17px;color:${c};text-transform:uppercase">${n}</h4>
        <div class="mini" style="margin:4px 0 9px">${p}</div>
        <p style="font-size:12.6px;color:var(--txt-dim)">${d}</p>
      </div>`).join('')}
  </div>

  <h3 class="sec-title">Городской словарь 2077</h3>
  <div class="grid3">
    ${[
      ['Подошва','Нижние ярусы города, где не бывает солнца. Дёшево, шумно, зато рядом с работой.'],
      ['Шпили','Верхние ярусы. Наркоматы, институты, вид на горизонт и очередь на двадцать лет.'],
      ['Сесть на канал','Подключиться к нейрошлему. «Он весь вечер на канале» — не комплимент.'],
      ['Железный','Человек с производственным протезом. Нейтрально в цеху, обидно в трамвае.'],
      ['Бумажник','Тот, кто принципиально не пользуется Сетью. От движения «Отключённые».'],
      ['Сорока','Нелегальный программист. По имени Нины Ковалец, хотя она это прозвище не любит.'],
      ['Тишина','Отдел НСБ, который «решает, чего вы не увидите». Вслух не произносится.'],
      ['Категория Д','Несуществующая графа, из которой контур берёт недостающих рабочих. Шутка Госплана, ставшая термином.'],
      ['Лунная надбавка','Любая зарплата, ради которой надо куда-то очень далеко уехать.'],
    ].map(([t, d]) => `<div class="card pad"><b style="font-family:var(--f-head);font-size:16px;color:var(--amber);text-transform:uppercase">${t}</b><p style="font-size:12.8px;color:var(--txt-dim);margin-top:6px">${d}</p></div>`).join('')}
  </div>
</div>`;

/* ===== 15. ЗАКОНЫ ===== */
PAGE.docs = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 15 · Свод законодательства ССР · извлечения</div>
  <h3 class="sec-title">Законы и акты</h3>
  <p class="sec-sub">Восемь документов, определяющих отношения гражданина, государства и Сети.</p>
  ${DB.docs.map(d => `
    <div class="doc">
      <div class="no">${esc(d.no)}</div>
      <h4>${esc(d.t)}</h4>
      <p>${esc(d.d)}</p>
    </div>`).join('')}
  <div class="note warn mt"><b>Внимание.</b> Приведены извлечения в изложении. Полные тексты доступны в контуре «Право» по служебному допуску.</div>
</div>`;

/* ===== 16. ВИКТОРИНА ===== */
PAGE.quiz = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 16 · Всесоюзное общество «Знание»</div>
  <h3 class="sec-title">Проверка знаний</h3>
  <p class="sec-sub">Восемь вопросов о мире 2077 года. Результат в личное дело не заносится. Вероятно.</p>
  <div class="quiz" id="quiz"></div>
</div>`;

/* ===== 17. ТЕРМИНАЛ ===== */
PAGE.terminal = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 17 · Терминал «Электроника БК-9000» · гражданский допуск</div>
  <h3 class="sec-title">Терминал доступа</h3>
  <p class="sec-sub">Прямая командная строка контура «Быт-4». Наберите <b style="color:var(--cyan)">помощь</b> для списка команд.</p>
  <div class="term" id="term"></div>
  <div class="terminp">
    <span>ОГАС&gt;</span>
    <input id="terminp" autocomplete="off" placeholder="введите команду и нажмите Enter">
  </div>
  <div class="note mt"><b>Напоминание НСБ.</b> Все команды журналируются. Это не угроза, это бухгалтерия.</div>
</div>`;

/* ===== 18. СПРАВКА ===== */
PAGE.faq = () => `
<div class="wrap">
  <div class="eyebrow">Раздел 18 · Справочная контура «Быт-4»</div>
  <h3 class="sec-title">Вопросы и ответы</h3>
  <p class="sec-sub">Шесть вопросов, которые чаще всего задают терминалу.</p>
  ${DB.faq.map(f => `
    <details class="acc">
      <summary>${esc(f.q)}</summary>
      <div class="acc-b"><p>${esc(f.a)}</p></div>
    </details>`).join('')}

  <h3 class="sec-title">О проекте</h3>
  <div class="card pad">
    <p style="font-size:14px;line-height:1.8">«Красная Сеть / 2077» — художественный вымысел в жанре советского киберпанка.
    Это альтернативная история: точка расхождения — 1965 год. Все персонажи, организации, товары, законы и события придуманы.
    Все изображения сгенерированы нейросетью специально для проекта. Настоящими являются только очертания государств
    и государственные флаги на карте — они взяты из открытых наборов данных.</p>
    <p style="font-size:14px;line-height:1.8;margin-top:12px">Проект не пропагандирует и не осуждает — он моделирует.
    Мир, который вы видите, намеренно неоднозначен: в нём решена проблема голода и не решена проблема свободы,
    построена машина умнее людей и не придумано, что с ней делать.</p>
    <div class="per-meta"><span class="tag red">Художественное произведение</span><span class="tag cyan">Альтернативная история</span><span class="tag amber">Советский киберпанк</span></div>
  </div>
</div>`;

/* --------------------------------------------------------------- */
/*  СБОРКА И НАВИГАЦИЯ                                             */
/* --------------------------------------------------------------- */
function buildTabs() {
  $('#tabs').innerHTML = TABS.map(t =>
    `<button class="tab" data-tab="${t.id}"><i>${t.i}</i>${esc(t.n)}</button>`).join('');
  $('#main').innerHTML = TABS.map(t =>
    `<section class="page" id="p-${t.id}"></section>`).join('');
  $('#menulist').innerHTML = TABS.map(t =>
    `<button data-tab="${t.id}"><i>${t.i}</i>${esc(t.n)}</button>`).join('');
}

const built = {};
function go(id, push = true) {
  if (!TABS.some(t => t.id === id)) id = 'home';
  $$('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === id));
  $$('#menulist button').forEach(b => b.classList.toggle('on', b.dataset.tab === id));
  $$('.page').forEach(p => p.classList.toggle('on', p.id === 'p-' + id));
  if (!built[id]) {
    $('#p-' + id).innerHTML = PAGE[id]();
    built[id] = true;
    (INIT[id] || (() => {}))();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (push) history.replaceState(null, '', '#' + id);
  document.title = (id === 'home' ? '' : TABS.find(t => t.id === id).n + ' · ') + 'КРАСНАЯ СЕТЬ · 2077';
  closeMenu();
}

/* ---- бургер-меню ---- */
function openMenu() {
  $('#menu').classList.add('on');
  $('#backdrop').classList.add('on');
  $('#burger').classList.add('on');
  $('#burger').setAttribute('aria-expanded', 'true');
  $('#menu').setAttribute('aria-hidden', 'false');
}
function closeMenu() {
  if (!$('#menu').classList.contains('on')) return;
  $('#menu').classList.remove('on');
  $('#burger').classList.remove('on');
  $('#burger').setAttribute('aria-expanded', 'false');
  $('#menu').setAttribute('aria-hidden', 'true');
  if (!$('#drawer').classList.contains('on')) $('#backdrop').classList.remove('on');
}

/* --------------------------------------------------------------- */
/*  ИНИЦИАЛИЗАТОРЫ СТРАНИЦ                                         */
/* --------------------------------------------------------------- */
const INIT = {};

/* ---- МАГАЗИН ---- */
let CART = {};
try { CART = JSON.parse(localStorage.getItem('zarya_cart') || '{}'); } catch { CART = {}; }
let shopCat = 'all', shopQ = '', shopSort = 'def';

INIT.shop = () => {
  $('#q').oninput = e => { shopQ = e.target.value.toLowerCase().trim(); renderGoods(); };
  $('#sort').onchange = e => { shopSort = e.target.value; renderGoods(); };
  $('#chips').onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip').forEach(c => c.classList.toggle('on', c === b));
    shopCat = b.dataset.cat; renderGoods();
  };
  renderGoods();
};

function renderGoods() {
  let list = DB.goods.filter(g =>
    (shopCat === 'all' || g.cat === shopCat) &&
    (!shopQ || (g.n + ' ' + g.short + ' ' + g.full + ' ' + g.art).toLowerCase().includes(shopQ)));
  if (shopSort === 'asc')  list = [...list].sort((a, b) => a.price - b.price);
  if (shopSort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  if (shopSort === 'az')   list = [...list].sort((a, b) => a.n.localeCompare(b.n, 'ru'));

  const st = { y: ['есть в наличии', 'y'], l: ['ограниченно', 'l'], n: ['снято с продажи', 'n'] };
  $('#found').textContent = `Найдено позиций: ${list.length} из ${DB.goods.length}`;
  $('#goods').innerHTML = list.length ? list.map(g => `
    <article class="good">
      <div class="good-ph" data-good="${g.id}">
        ${g.badge ? `<span class="good-badge ${g.stock === 'n' ? 'def' : (g.badge === 'Лимит' || g.badge === 'Диковина' ? 'lim' : '')}">${esc(g.badge)}</span>` : ''}
        ${IMG(g.img, g.n)}
      </div>
      <div class="good-b">
        <div class="good-art">${esc(g.art)}</div>
        <h4>${esc(g.n)}</h4>
        <p>${esc(g.short)}</p>
        <div class="stock ${st[g.stock][1]}">● ${st[g.stock][0]}</div>
        <div class="good-price"><b>${rub(g.price)}</b>${g.old ? `<s>${rub(g.old)}</s>` : ''}</div>
        <div class="good-row">
          <button class="btn ghost" data-good="${g.id}">Подробно</button>
          ${g.stock === 'n'
            ? `<button class="btn" disabled style="opacity:.4;cursor:not-allowed">Изъято</button>`
            : `<button class="btn" data-add="${g.id}">В заказ</button>`}
        </div>
      </div>
    </article>`).join('')
    : `<div class="note" style="grid-column:1/-1">По запросу ничего не найдено. Контур предлагает изменить формулировку или выбрать другой раздел каталога.</div>`;
}

function openGood(id) {
  const g = DB.goods.find(x => x.id === id); if (!g) return;
  $('#modalin').innerHTML = `
    <button class="modal-x" data-close>×</button>
    <div class="modal-grid">
      <div class="modal-ph">${IMG(g.img, g.n)}
        <div class="ph-foot"><span>Образец · торгсеть «Заря»</span><b>${esc(g.art)}</b></div>
      </div>
      <div class="modal-b">
        <div class="good-art">${esc(g.art)} · ${esc(DB.cats.find(c => c.id === g.cat).n)}</div>
        <h3>${esc(g.n)}</h3>
        <div class="good-price" style="margin:10px 0"><b>${rub(g.price)}</b>${g.old ? `<s>${rub(g.old)}</s>` : ''}<span>цена государственная, единая по Союзу</span></div>
        <p style="font-size:13.5px;color:var(--txt-dim)">${esc(g.full)}</p>
        <table class="specs">${g.specs.map(s => `<tr><td>${esc(s[0])}</td><td>${esc(s[1])}</td></tr>`).join('')}</table>
        ${g.warn ? `<div class="note warn"><b>Предупреждение:</b> ${esc(g.warn)}</div>` : ''}
        ${g.stock === 'n'
          ? `<div class="note warn mt"><b>Позиция изъята из оборота.</b> Оформление наряда невозможно.</div>`
          : `<button class="btn amber mt" data-add="${g.id}" style="width:100%;justify-content:center">Добавить в наряд-заказ</button>`}
      </div>
    </div>`;
  $('#modal').classList.add('on');
}

function openChar(id) {
  const c = DB.chars.find(x => x.id === id); if (!c) return;
  $('#modalin').innerHTML = `
    <button class="modal-x" data-close>×</button>
    <div class="modal-grid">
      <div class="modal-ph">${IMG(c.img, c.name)}
        <div class="ph-foot"><span>Фото идентификационное · ОГАС-учёт</span><b>${esc(c.code)}</b></div>
      </div>
      <div class="modal-b">
        <div class="good-art">ЛИЧНОЕ ДЕЛО ${esc(c.code)} · ${esc(c.loyal)}</div>
        <h3>${esc(c.name)}</h3>
        <div class="per-role">${esc(c.role)}</div>
        <div class="per-meta" style="margin:10px 0">${c.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <p style="font-size:13.6px;color:var(--txt-dim)">${esc(c.bio)}</p>
        <div class="per-quote" style="margin:14px 0">«${esc(c.quote)}»</div>
        <table class="specs">
          <tr><td>Возраст</td><td>${esc(c.age)}</td></tr>
          <tr><td>Место и год рождения</td><td>${esc(c.born)}</td></tr>
          ${c.stats.map(s => `<tr><td>${esc(s[0])}</td><td>${esc(s[1])}</td></tr>`).join('')}
        </table>
        <div class="note"><b>Гриф.</b> Сведения приведены в объёме, допустимом для гражданского уровня доступа.</div>
      </div>
    </div>`;
  $('#modal').classList.add('on');
}

function openPoster(src, t, d) {
  $('#modalin').innerHTML = `
    <button class="modal-x" data-close>×</button>
    <div style="background:#0a0d11">${IMG(src, t)}</div>
    <div style="padding:18px 22px">
      <h3 style="font-family:var(--f-head);font-size:21px;color:#fff;text-transform:uppercase">${esc(t)}</h3>
      <p style="font-size:13px;color:var(--txt-dim);margin-top:6px">${esc(d)}</p>
    </div>`;
  $('#modal').classList.add('on');
}

/* ---- КОРЗИНА ---- */
function cartSave() { try { localStorage.setItem('zarya_cart', JSON.stringify(CART)); } catch {} }
function cartAdd(id) {
  const g = DB.goods.find(x => x.id === id); if (!g || g.stock === 'n') return;
  CART[id] = (CART[id] || 0) + 1; cartSave(); cartDraw();
  toast('Добавлено в наряд: ' + g.n);
}
function cartDraw() {
  const ids = Object.keys(CART).filter(i => CART[i] > 0);
  const n = ids.reduce((s, i) => s + CART[i], 0);
  $('#cartn').textContent = n;
  const sum = ids.reduce((s, i) => s + DB.goods.find(g => g.id === i).price * CART[i], 0);
  $('#carttotal').textContent = rub(sum);
  $('#cartmini').textContent = sum === 0 ? 'Наряд пуст'
    : sum > 10000 ? `Требуется виза профкома. Рассрочка: ${Math.ceil(sum / 1240)} мес. средней зарплаты.`
    : `Доставка контуром «Быт» — 2 суток. Талонов не требуется.`;
  $('#cartbody').innerHTML = ids.length ? ids.map(i => {
    const g = DB.goods.find(x => x.id === i);
    return `<div class="citem">
      ${IMG(g.img, g.n)}
      <div class="citem-b">
        <b>${esc(g.n)}</b><span>${rub(g.price)} × ${CART[i]} = ${rub(g.price * CART[i])}</span>
        <div class="qty">
          <button data-q="-" data-id="${i}">−</button><i>${CART[i]}</i><button data-q="+" data-id="${i}">+</button>
        </div>
      </div>
      <button class="crm" data-q="x" data-id="${i}">×</button>
    </div>`;
  }).join('') : `<div class="note">Наряд-заказ пуст. Откройте <b>торгсеть «Заря»</b> и выберите изделия.</div>`;
}

let toastT;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2300);
}

/* ---- КАРТА ---- */
let WORLD = null, selISO = null, mapZoom = 1, mapX = 0, mapY = 0;

async function loadWorld() {
  if (WORLD) return WORLD;
  const r = await fetch('assets/data/world.json');
  WORLD = await r.json();
  const b = {};
  for (const k in DB.blocs) for (const iso of DB.blocs[k].list) b[iso] = k;
  WORLD.blocOf = b;
  return WORLD;
}

INIT.map = async () => {
  const w = await loadWorld();
  $('#mapcount').textContent = w.countries.length;
  const svg = $('#worldmap');
  svg.innerHTML = `<g id="mapg">` + w.countries.map(c =>
    `<path class="cn ${w.blocOf[c.iso2] || 'bx'}" d="${c.d}" data-iso="${c.iso2 || ''}" data-id="${c.id}"><title>${esc(c.ru)}</title></path>`
  ).join('') + `</g>`;

  $('#legend').innerHTML = Object.entries(DB.blocs)
    .map(([k, v]) => `<span><i style="background:${v.c}"></i>${esc(v.n)}</span>`).join('')
    + `<span><i style="background:#1b2530"></i>Прочие территории</span>`;

  const draw = () => {
    $('#clist').innerHTML = w.countries
      .filter(c => !cq || c.ru.toLowerCase().includes(cq))
      .map(c => `<button data-pick="${c.id}" class="${selISO === c.id ? 'on' : ''}">
        ${c.iso2 ? `<img src="assets/flags/${c.iso2.toLowerCase()}.svg" alt="" onerror="this.style.visibility='hidden'">` : '<img alt="">'}
        ${esc(c.ru)}</button>`).join('');
  };
  let cq = '';
  $('#csearch').oninput = e => { cq = e.target.value.toLowerCase().trim(); draw(); };
  draw();

  svg.addEventListener('click', e => {
    const p = e.target.closest('path'); if (p) pickCountry(p.dataset.id);
  });
  $('#clist').addEventListener('click', e => {
    const b = e.target.closest('[data-pick]'); if (b) pickCountry(b.dataset.pick);
  });

  /* масштаб и перетаскивание */
  const apply = () => $('#mapg').setAttribute('transform', `translate(${mapX},${mapY}) scale(${mapZoom})`);
  $$('.maptools button').forEach(b => b.onclick = () => {
    if (b.dataset.z === 'in')  mapZoom = Math.min(8, mapZoom * 1.4);
    if (b.dataset.z === 'out') mapZoom = Math.max(1, mapZoom / 1.4);
    if (b.dataset.z === 'reset') { mapZoom = 1; mapX = 0; mapY = 0; }
    apply();
  });
  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const k = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    const nz = Math.min(8, Math.max(1, mapZoom * k));
    const r = svg.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * 1000, py = (e.clientY - r.top) / r.height * 520;
    mapX = px - (px - mapX) * (nz / mapZoom);
    mapY = py - (py - mapY) * (nz / mapZoom);
    mapZoom = nz; apply();
  }, { passive: false });
  let drag = null;
  svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, mx: mapX, my: mapY }; svg.setPointerCapture(e.pointerId); });
  svg.addEventListener('pointermove', e => {
    if (!drag) return;
    const r = svg.getBoundingClientRect();
    mapX = drag.mx + (e.clientX - drag.x) / r.width * 1000;
    mapY = drag.my + (e.clientY - drag.y) / r.height * 520;
    apply();
  });
  svg.addEventListener('pointerup', () => drag = null);
  svg.addEventListener('pointercancel', () => drag = null);

  pickCountry(WORLD.countries.find(c => c.iso2 === 'SU').id);
};

/* процедурное досье для стран без ручного описания */
function autoInfo(c) {
  const bl = WORLD.blocOf[c.iso2];
  const txt = {
    b0: 'Единое союзное государство: 19 республик от Балтики до Тихого океана. Полная интеграция в контуры ОГАС, единая валюта, единый плановый горизонт.',
    b1: 'Государство Организации Варшавского Договора. Согласованное планирование, общий оборонный контур, безвизовый режим с Союзом.',
    b2: 'Страна социалистической ориентации. Техническое содействие Союза, частичная интеграция в отраслевые контуры, льготные поставки оборудования.',
    b3: 'Участник Движения неприсоединения. Торгует с обоими блоками, сетевой стандарт собственный либо гибридный.',
    b4: 'Государство Атлантического блока. Корпоративная модель сетевой инфраструктуры, ограниченный обмен данными с ОГАС.',
  }[bl] || 'Территория вне основных блоков влияния. Данные контура «Глобус» ограничены общедоступными сведениями.';
  return { cap: '—', pop: '—', role: txt, note: 'Развёрнутое досье доступно по служебному уровню допуска.' };
}

function pickCountry(id) {
  const c = WORLD.countries.find(x => String(x.id) === String(id)); if (!c) return;
  selISO = c.id;
  $$('#worldmap path').forEach(p => p.classList.toggle('sel', p.dataset.id === String(id)));
  const info = (c.iso2 && DB.cinfo[c.iso2]) || autoInfo(c);
  const bl = WORLD.blocOf[c.iso2];
  $('#cinfo').innerHTML = `
    ${c.iso2 ? `<img class="cflag" src="assets/flags/${c.iso2.toLowerCase()}.svg" alt="Флаг: ${esc(c.ru)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'imgph',textContent:'ФЛАГ НЕ НАЙДЕН'}))">` : ''}
    <h3>${esc(c.ru)}</h3>
    <div class="iso">${esc(c.iso2 || '—')} · ${esc(c.en)}</div>
    <div class="per-meta" style="margin-bottom:10px">
      <span class="tag" style="border-color:${bl ? DB.blocs[bl].c : 'var(--line-2)'};color:${bl ? DB.blocs[bl].c : 'var(--txt-dim)'}">${bl ? esc(DB.blocs[bl].n) : 'Вне блоков'}</span>
    </div>
    <p style="font-size:13px;color:var(--txt-dim);margin-bottom:10px">${esc(info.role)}</p>
    <div class="cfacts">
      <div><span>Столица</span><span>${esc(info.cap)}</span></div>
      <div><span>Население</span><span>${esc(info.pop)}</span></div>
      <div><span>Координаты</span><span>${c.lat}°, ${c.lon}°</span></div>
      <div><span>Код контура</span><span>ГЛБ-${String(c.id).padStart(3, '0')}</span></div>
    </div>
    <div class="note" style="margin-top:12px;font-size:12px">${esc(info.note)}</div>`;
  const b = $(`#clist [data-pick="${c.id}"]`);
  $$('#clist button').forEach(x => x.classList.remove('on'));
  if (b) { b.classList.add('on'); b.scrollIntoView({ block: 'nearest' }); }
}

/* ---- СТЕНА ФЛАГОВ ---- */
INIT.flags = async () => {
  const w = await loadWorld();
  const list = w.countries.filter(c => c.iso2);
  const draw = (q = '') => {
    const f = list.filter(c => c.ru.toLowerCase().includes(q));
    $('#flagwall').innerHTML = f.map(c => `
      <figure data-flag="${c.id}">
        <img src="assets/flags/${c.iso2.toLowerCase()}.svg" alt="Флаг: ${esc(c.ru)}" loading="lazy">
        <figcaption title="${esc(c.ru)}">${esc(c.ru)}</figcaption>
      </figure>`).join('') || '<div class="note">Ничего не найдено.</div>';
  };
  draw();
  $('#fsearch').oninput = e => draw(e.target.value.toLowerCase().trim());
  $('#flagwall').addEventListener('click', async e => {
    const f = e.target.closest('[data-flag]'); if (!f) return;
    const id = f.dataset.flag;
    go('map');
    await new Promise(r => setTimeout(r, 60));
    pickCountry(id);
  });
};

/* ---- ВИКТОРИНА ---- */
INIT.quiz = () => {
  let i = 0, score = 0, locked = false;
  const draw = () => {
    if (i >= DB.quiz.length) {
      const verdict = score >= 7 ? ['Особый уровень допуска', 'Товарищ, вы знаете о Сети подозрительно много. Отдел «Тишина» уже в курсе.']
        : score >= 5 ? ['Служебный уровень допуска', 'Достойный результат. Госплан отмечает вас в сводке.']
        : score >= 3 ? ['Гражданский уровень допуска', 'Нормально. Рекомендуется повторное чтение раздела «Мир 2077».']
        : ['Требуется политпросвещение', 'Запишитесь в кружок общества «Знание» при домоуправлении.'];
      $('#quiz').innerHTML = `
        <div class="eyebrow">Испытание завершено</div>
        <h4>Результат: ${score} из ${DB.quiz.length}</h4>
        <div class="stamp" style="margin:12px 0">${verdict[0]}</div>
        <p style="font-size:13.5px;color:var(--txt-dim)">${verdict[1]}</p>
        <button class="btn mt" id="qagain">Пройти заново</button>`;
      $('#qagain').onclick = () => { i = 0; score = 0; locked = false; draw(); };
      return;
    }
    const q = DB.quiz[i];
    $('#quiz').innerHTML = `
      <div class="qprog">${DB.quiz.map((_, k) => `<i class="${k < i ? 'done' : ''}"></i>`).join('')}</div>
      <div class="eyebrow">Вопрос ${i + 1} из ${DB.quiz.length} · верных: ${score}</div>
      <h4>${esc(q.q)}</h4>
      <div id="qopts">${q.a.map((a, k) => `<button class="qopt" data-k="${k}">${esc(a)}</button>`).join('')}</div>
      <div id="qexp"></div>`;
    $('#qopts').onclick = e => {
      const b = e.target.closest('.qopt'); if (!b || locked) return;
      locked = true;
      const k = +b.dataset.k;
      $$('.qopt').forEach((o, n) => {
        if (n === q.r) o.classList.add('right');
        else if (n === k) o.classList.add('wrong');
      });
      if (k === q.r) score++;
      $('#qexp').innerHTML = `<div class="note mt"><b>${k === q.r ? 'Верно.' : 'Неверно.'}</b> ${esc(q.e)}</div>
        <button class="btn mt" id="qnext">Дальше →</button>`;
      $('#qnext').onclick = () => { i++; locked = false; draw(); };
    };
  };
  draw();
};

/* ---- ТЕРМИНАЛ ---- */
INIT.terminal = () => {
  const t = $('#term');
  const put = (html, cls = '') => {
    t.insertAdjacentHTML('beforeend', `<div class="${cls}">${html}</div>`);
    t.scrollTop = t.scrollHeight;
  };
  put(`<span class="d">ОГАС / контур «Быт-4» / узел МСК-ГВЦ-1</span>`);
  put(`<span class="d">Терминал «Электроника БК-9000», ПЗУ 77.4</span>`);
  put(`Соединение установлено. Уровень допуска: <span class="w">ГРАЖДАНСКИЙ</span>.`);
  put(`Наберите <span class="p">помощь</span> для списка команд.`);

  const CMD = {
    'помощь': () => `Доступные команды:
  <span class="p">сводка</span>      — оперативные показатели Союза
  <span class="p">план</span>        — выполнение XVII пятилетки
  <span class="p">досье ИМЯ</span>   — личное дело (напр.: досье Морозов)
  <span class="p">каталог</span>     — позиции торгсети «Заря»
  <span class="p">страна КОД</span>  — справка по стране (напр.: страна SU)
  <span class="p">хроника</span>     — ключевые даты
  <span class="p">время</span>       — время по Москве
  <span class="p">фракции</span>     — расклад в Верховном Совете
  <span class="p">анекдот</span>     — то, за что раньше давали срок
  <span class="p">доступ</span>      — попытка повысить уровень допуска
  <span class="p">очистить</span>    — очистить экран`,
    'сводка': () => DB.kpi.map(k => `  ${k.n.padEnd(34, '.')} <span class="w">${k.v}</span> (${k.d})`).join('\n'),
    'план': () => DB.plan.map(r => `  ${r[0].padEnd(16)} ${r[1].padEnd(26)} <span class="w">${r[4]}</span> ${r[5] === 'вып.' ? '' : '<span class="p">отставание</span>'}`).join('\n'),
    'каталог': () => DB.goods.map(g => `  ${g.art.padEnd(16)} ${g.n.padEnd(38, '.')} ${g.price.toLocaleString('ru-RU')} ₽ ${g.stock === 'n' ? '<span class="p">[ИЗЪЯТО]</span>' : ''}`).join('\n'),
    'хроника': () => DB.timeline.map(e => `  <span class="w">${e.y}</span>  ${e.t}`).join('\n'),
    'фракции': () => DB.factions.map(f => `  ${String(f.p).padStart(3)}%  ${f.n} — ${f.s}`).join('\n'),
    'время': () => `  Москва: <span class="w">${new Date().toLocaleTimeString('ru-RU')}</span>, ${new Date().toLocaleDateString('ru-RU')} (2077 условно)\n  Луна, база «Заря»: то же время, другое небо.`,
    'анекдот': () => {
      const a = [
        'Приходит гражданин в райком: «Хочу жаловаться на Госплан-9». — «На что именно?» — «Он меня понимает». ',
        'Вопрос армянскому радио: возможен ли отказ Сети? Отвечаем: возможен, но план по отказам уже перевыполнен на 104%.',
        'Объявление: «Меняю нейрошлем седьмой модели на тишину в голове. Доплачу».',
        '— Товарищ, у вас железная рука! — Это не рука. Это счёт, который завод забыл оплатить.',
        'Контур «Быт» рассчитал оптимальную очередь на жильё. Очередь на ознакомление с расчётом — три года.',
        'Отдел «Тишина» опроверг слухи о своём существовании. Слухи опровергнуты заочно, источник слухов уведомлён.',
      ];
      return '  ' + a[Math.floor(Math.random() * a.length)];
    },
    'доступ': () => `  Запрос на повышение уровня допуска отправлен.
  Ответ контура: <span class="p">ОТКАЗАНО</span>.
  Основание: гражданин не состоит в номенклатурном перечне.
  Запрос зарегистрирован. Номер: ${Math.floor(Math.random() * 900000 + 100000)}.
  <span class="d">Отдел «Тишина» уведомлён автоматически. Хорошего дня.</span>`,
  };

  const run = raw => {
    const s = raw.trim(); if (!s) return;
    put(`<span class="p">ОГАС&gt;</span> ${esc(s)}`);
    const [cmd, ...rest] = s.toLowerCase().split(/\s+/);
    const arg = rest.join(' ');
    if (cmd === 'очистить') { t.innerHTML = ''; return; }
    if (cmd === 'досье') {
      const c = DB.chars.find(x => x.name.toLowerCase().includes(arg) || x.id === arg);
      if (!c) return put(`  <span class="p">Дело не найдено.</span> Попробуйте: ${DB.chars.map(x => x.id).join(', ')}`);
      return put(`  <span class="w">${esc(c.name)}</span>\n  ${esc(c.role)}\n  Код: ${esc(c.code)} · ${esc(c.loyal)}\n  ${esc(c.bio.slice(0, 260))}…\n  <span class="d">«${esc(c.quote)}»</span>`);
    }
    if (cmd === 'страна') {
      const k = arg.toUpperCase();
      const i = DB.cinfo[k];
      if (!i) return put(`  <span class="p">Досье отсутствует.</span> Доступны: ${Object.keys(DB.cinfo).join(', ')}`);
      return put(`  <span class="w">${k}</span> · столица ${esc(i.cap)} · население ${esc(i.pop)}\n  ${esc(i.role)}\n  <span class="d">${esc(i.note)}</span>`);
    }
    if (CMD[cmd]) return put(CMD[cmd]().replace(/\n/g, '<br>'));
    put(`  <span class="p">Команда не распознана:</span> ${esc(cmd)}. Наберите «помощь».`);
  };

  $('#terminp').addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(e.target.value); e.target.value = ''; }
  });
};

/* --------------------------------------------------------------- */
/*  ГЛОБАЛЬНЫЕ СОБЫТИЯ                                             */
/* --------------------------------------------------------------- */
document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) return go(tab.dataset.tab);

  const goto = e.target.closest('[data-goto]');
  if (goto) { e.preventDefault(); return go(goto.dataset.goto); }

  const add = e.target.closest('[data-add]');
  if (add) return cartAdd(add.dataset.add);

  const good = e.target.closest('[data-good]');
  if (good) return openGood(good.dataset.good);

  const ch = e.target.closest('[data-char]');
  if (ch) return openChar(ch.dataset.char);

  const po = e.target.closest('[data-poster]');
  if (po) return openPoster(po.dataset.poster, po.dataset.t, po.dataset.d);

  if (e.target.closest('[data-close]') || e.target.id === 'modal') $('#modal').classList.remove('on');

  const q = e.target.closest('[data-q]');
  if (q) {
    const id = q.dataset.id;
    if (q.dataset.q === '+') CART[id]++;
    if (q.dataset.q === '-') CART[id] = Math.max(0, CART[id] - 1);
    if (q.dataset.q === 'x') delete CART[id];
    if (CART[id] === 0) delete CART[id];
    cartSave(); cartDraw();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { $('#modal').classList.remove('on'); closeCart(); closeMenu(); }
});

const openCart = () => { $('#drawer').classList.add('on'); $('#backdrop').classList.add('on'); };
const closeCart = () => {
  $('#drawer').classList.remove('on');
  if (!$('#menu').classList.contains('on')) $('#backdrop').classList.remove('on');
};
$('#cartbtn').onclick = openCart;
$('#cartx').onclick = closeCart;
$('#backdrop').onclick = () => { closeCart(); closeMenu(); };
$('#burger').onclick = () => ($('#menu').classList.contains('on') ? closeMenu() : openMenu());
$('#cartorder').onclick = () => {
  const n = Object.values(CART).reduce((a, b) => a + b, 0);
  if (!n) return toast('Наряд-заказ пуст');
  const no = Math.floor(Math.random() * 900000 + 100000);
  toast(`Наряд №${no} принят. Доставка — 2 суток.`);
  CART = {}; cartSave(); cartDraw(); closeCart();
};

/* часы и бегущая строка */
function clock() {
  const d = new Date();
  $('#clock').textContent = d.toLocaleTimeString('ru-RU') + ' МСК';
}
setInterval(clock, 1000); clock();

$('#ticker').textContent = DB.ticker.join('  ★  ') + '  ★  ';
$('#citizen').textContent = 'СС-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 90 + 10);

/* запуск */
buildTabs();
cartDraw();
go(location.hash.replace('#', '') || 'home', false);
window.addEventListener('hashchange', () => go(location.hash.replace('#', '') || 'home', false));
