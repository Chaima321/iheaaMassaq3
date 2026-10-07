/* =====================================================================
   متابعة حفظ القرآن الكريم — برنامج البناء المنهجي (مساق 3)
   - المستويات 1 و2 و3 (ص 1–301): مأخوذة من ملف المعهد.
   - المستويات 4 إلى 7 (ص 302–604): امتداد بنفس الوتيرة حتى ختم القرآن.
   لتغيير تاريخ البداية عدّل START (يجب أن يكون يوم أحد).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------- إعدادات ---------------------------- */
  const START = new Date(2026, 9, 4);          // الأحد 4 أكتوبر 2026
  const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const LAST_PAGE = 604;
  const TOTAL_STAGES = 61;                      // 60 مرحلة كاملة + مرحلة الختم
  const PASS_MARK = 12;                         // من 20 (= 60٪)
  const STORAGE_KEY = 'bina-tracker-v1';

  const LEVELS = {
    1: { desc: 'من الفاتحة إلى النساء (147) · ص 1–101', ext: false },
    2: { desc: 'من النساء (148) إلى التوبة (93) · ص 102–201', ext: false },
    3: { desc: 'من التوبة (94) إلى الكهف (74) · ص 202–301', ext: false },
    4: { desc: 'ص 302–401 · الأجزاء 16–20', ext: true },
    5: { desc: 'ص 402–501 · الأجزاء 21–25', ext: true },
    6: { desc: 'ص 502–601 · الأجزاء 26–30', ext: true },
    7: { desc: 'ص 602–604 · ختم القرآن', ext: true }
  };

  /* آيات كل أسبوع حفظ (4 أسابيع لكل مرحلة) — من ملف المعهد */
  const AYAT = {
    1: ['الفاتحة (1–7) + البقرة 1–20', 'البقرة 21–37', 'البقرة 38–60', 'البقرة 61–76'],
    2: ['البقرة 77–90', 'البقرة 91–105', 'البقرة 106–123', 'البقرة 124–141'],
    3: ['البقرة 142–158', 'البقرة 159–176', 'البقرة 177–187', 'البقرة 188–202'],
    4: ['البقرة 203–217', 'البقرة 218–230', 'البقرة 231–241', 'البقرة 242–252'],
    5: ['البقرة 253–261', 'البقرة 262–274', 'البقرة 275–284', 'البقرة 285–286 + آل عمران 1–15'],
    6: ['آل عمران 16–34', 'آل عمران 35–52', 'آل عمران 53–74', 'آل عمران 75–91'],
    7: ['آل عمران 92–111', 'آل عمران 112–132', 'آل عمران 133–151', 'آل عمران 152–165'],
    8: ['آل عمران 166–183', 'آل عمران 184–200', 'النساء 1–13', 'النساء 14–23'],
    9: ['النساء 24–34', 'النساء 35–51', 'النساء 52–70', 'النساء 71–86'],
    10: ['النساء 87–97', 'النساء 98–113', 'النساء 114–130', 'النساء 131–147'],
    11: ['النساء 148–165', 'النساء 166–176 + المائدة 1–2', 'المائدة 3–12', 'المائدة 13–23'],
    12: ['المائدة 24–40', 'المائدة 41–50', 'المائدة 51–67', 'المائدة 68–83'],
    13: ['المائدة 84–99', 'المائدة 100–113', 'المائدة 114–120 + الأنعام 1–13', 'الأنعام 14–25'],
    14: ['الأنعام 26–56', 'الأنعام 57–73', 'الأنعام 74–92', 'الأنعام 93–110'],
    15: ['الأنعام 111–128', 'الأنعام 129–142', 'الأنعام 143–153', 'الأنعام 154–165 + الأعراف 1–11'],
    16: ['الأعراف 12–33', 'الأعراف 34–51', 'الأعراف 52–70', 'الأعراف 71–87'],
    17: ['الأعراف 88–112', 'الأعراف 113–137', 'الأعراف 138–153', 'الأعراف 154–163'],
    18: ['الأعراف 164–184', 'الأعراف 185–206', 'الأنفال 1–20', 'الأنفال 21–40'],
    19: ['الأنفال 41–57', 'الأنفال 58–75', 'التوبة 1–17', 'التوبة 18–31'],
    20: ['التوبة 32–44', 'التوبة 45–61', 'التوبة 62–75', 'التوبة 76–93'],
    21: ['التوبة 94–109', 'التوبة 110–122', 'التوبة 123–129 + يونس 1–10', 'يونس 11–25'],
    22: ['يونس 26–47', 'يونس 48–70', 'يونس 71–92', 'يونس 93–109 + هود 1–5'],
    23: ['هود 6–23', 'هود 24–45', 'هود 46–66', 'هود 67–88'],
    24: ['هود 89–112', 'هود 113–123 + يوسف 1–14', 'يوسف 15–34', 'يوسف 35–52'],
    25: ['يوسف 53–75', 'يوسف 76–95', 'يوسف 96–111 + الرعد 1–3', 'الرعد 4–18'],
    26: ['الرعد 19–38', 'الرعد 39–43 + إبراهيم 1–10', 'إبراهيم 11–30', 'إبراهيم 31–52'],
    27: ['الحجر 1–43', 'الحجر 44–90', 'الحجر 91–99 + النحل 1–22', 'النحل 23–42'],
    28: ['النحل 43–69', 'النحل 70–87', 'النحل 88–106', 'النحل 107–128'],
    29: ['الإسراء 1–22', 'الإسراء 23–49', 'الإسراء 50–70', 'الإسراء 71–96'],
    30: ['الإسراء 97–111 + الكهف 1–10', 'الكهف 11–27', 'الكهف 28–49', 'الكهف 50–74']
  };

  /* صفحات بدايات السور في مصحف المدينة (لتسمية أسابيع الامتداد فقط) */
  const SURAHS = [
    ['الكهف', 293], ['مريم', 305], ['طه', 312], ['الأنبياء', 322], ['الحج', 332], ['المؤمنون', 342],
    ['النور', 350], ['الفرقان', 359], ['الشعراء', 367], ['النمل', 377], ['القصص', 385], ['العنكبوت', 396],
    ['الروم', 404], ['لقمان', 411], ['السجدة', 415], ['الأحزاب', 418], ['سبأ', 428], ['فاطر', 434],
    ['يس', 440], ['الصافات', 446], ['ص', 453], ['الزمر', 458], ['غافر', 467], ['فصلت', 477],
    ['الشورى', 483], ['الزخرف', 489], ['الدخان', 496], ['الجاثية', 499], ['الأحقاف', 502], ['محمد', 507],
    ['الفتح', 511], ['الحجرات', 515], ['ق', 518], ['الذاريات', 520], ['الطور', 523], ['النجم', 526],
    ['القمر', 528], ['الرحمن', 531], ['الواقعة', 534], ['الحديد', 537], ['المجادلة', 542], ['الحشر', 545],
    ['الممتحنة', 549], ['الصف', 551], ['الجمعة', 553], ['المنافقون', 554], ['التغابن', 556], ['الطلاق', 558],
    ['التحريم', 560], ['الملك', 562], ['القلم', 564], ['الحاقة', 566], ['المعارج', 568], ['نوح', 570],
    ['الجن', 572], ['المزمل', 574], ['المدثر', 575], ['القيامة', 577], ['الإنسان', 578], ['المرسلات', 580],
    ['النبأ', 582], ['النازعات', 583], ['عبس', 585], ['التكوير', 586], ['الانفطار', 587], ['المطففين', 587],
    ['الانشقاق', 589], ['البروج', 590], ['الطارق', 591], ['الأعلى', 591], ['الغاشية', 592], ['الفجر', 593],
    ['البلد', 594], ['الشمس', 595], ['الليل', 595], ['الضحى', 596], ['الشرح', 596], ['التين', 597],
    ['العلق', 597], ['القدر', 598], ['البينة', 598], ['الزلزلة', 599], ['العاديات', 599], ['القارعة', 600],
    ['التكاثر', 600], ['العصر', 601], ['الهمزة', 601], ['الفيل', 601], ['قريش', 602], ['الماعون', 602],
    ['الكوثر', 602], ['الكافرون', 603], ['النصر', 603], ['المسد', 603], ['الإخلاص', 604], ['الفلق', 604],
    ['الناس', 604]
  ];

  /* ---------------------------- أدوات ---------------------------- */
  const fmtFull = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
  const fmtDM = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long' });
  const num = n => Number(n).toLocaleString('en-US');
  const $ = id => document.getElementById(id);

  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function dayDiff(a, b) {
    const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((ub - ua) / 86400000);
  }
  const rng = (a, b) => (a === b ? `ص ${a}` : `من ص ${a} إلى ص ${b}`);

  function surahsIn(a, b) {
    const out = [];
    for (let i = 0; i < SURAHS.length; i++) {
      const st = SURAHS[i][1];
      const nx = i + 1 < SURAHS.length ? SURAHS[i + 1][1] : LAST_PAGE;
      if (st <= b && nx >= a) out.push(SURAHS[i][0]);
    }
    return out;
  }

  /* --------------- بناء الجدول: الأسابيع 1..302 ---------------
     كل مرحلة = 4 أسابيع حفظ + أسبوع اختبار. كل أسبوع = 5 أيام × نصف وجه.
     المرحلة s تبدأ من الصفحة 10(s-1)+2 (والمرحلة 1: ص1 وص2 كاملتان لقصرهما). */
  const WEEKS = [];
  (function build() {
    let prev = null;
    for (let s = 1; s <= TOTAL_STAGES; s++) {
      const P0 = 10 * (s - 1) + 2;
      const isLast = s === TOTAL_STAGES;
      let units = [];
      if (isLast) {
        units = [
          { page: 602, part: 'f' }, { page: 602, part: 's' },
          { page: 603, part: 'f' }, { page: 603, part: 's' },
          { page: 604, part: 'w' }
        ];
      } else {
        for (let u = 0; u < 20; u++) units.push({ page: P0 + Math.floor(u / 2), part: u % 2 === 0 ? 'f' : 's' });
        if (s === 1) { units[0] = { page: 1, part: 'w' }; units[1] = { page: 2, part: 'w' }; }
      }
      units.forEach(u => { u.before = prev ? prev.page : 0; u.prev = prev; prev = u; });
      const memWeeks = isLast ? 1 : 4;
      for (let w = 0; w < memWeeks; w++) {
        WEEKS.push({ type: 'mem', stage: s, wk: w + 1, units: units.slice(w * 5, w * 5 + 5), hasNextWeek: w < memWeeks - 1 });
      }
      WEEKS.push({ type: 'exam', stage: s, wk: memWeeks + 1, endPage: prev.page });
    }
  })();

  const stageBase = s => (s - 1) * 5;
  const stageWeekCount = s => (s === TOTAL_STAGES ? 2 : 5);

  function stageInfo(s) {
    const isLast = s === TOTAL_STAGES;
    return {
      s,
      level: isLast ? 7 : Math.ceil(s / 10),
      inLevel: isLast ? 1 : ((s - 1) % 10) + 1,
      from: isLast ? 602 : (s === 1 ? 1 : 10 * (s - 1) + 2),
      to: isLast ? 604 : 10 * s + 1,
      cum: isLast ? 'ختم القرآن الكريم' : (s % 2 === 0 ? `إكمال الجزء ${s / 2}` : `نصف الجزء ${(s + 1) / 2}`)
    };
  }
  const stageName = i => (i.s === TOTAL_STAGES ? 'المرحلة الختامية' : `المرحلة ${i.inLevel}`);

  /* ---------------------- نصوص وصفية ---------------------- */
  function pageLabel(u) {
    if (u.part === 'w') return `الصفحة ${u.page} كاملة`;
    return `الصفحة ${u.page} (${u.part === 'f' ? 'النصف الأول' : 'النصف الثاني'})`;
  }
  function unitSub(u) {
    if (u.part === 'w') return u.page === LAST_PAGE ? 'كاملة — آخر صفحة' : 'كاملة (صفحة قصيرة)';
    return u.part === 'f' ? 'النصف الأول' : 'النصف الثاني';
  }
  const startDesc = u => (u.part === 's' ? `منتصف ص ${u.page}` : `بداية ص ${u.page}`);
  const endDesc = u => (u.part === 'f' ? `منتصف ص ${u.page}` : `نهاية ص ${u.page}`);

  function reviewHint(M, cap, wi, d) {
    const k = Math.ceil(M / cap);
    if (k <= 1) return rng(1, M);
    const j = (wi * 5 + d) % k;
    const from = Math.floor(j * M / k) + 1;
    const to = Math.ceil((j + 1) * M / k);
    return `مقطع اليوم (${j + 1} من ${k}): ${rng(from, to)}`;
  }

  /* ---------------------- بناء بطاقات كل أسبوع ---------------------- */
  function memDay(wi, w, u, d) {
    const items = [];
    items.push({ k: 'listen', t: `سماع ${pageLabel(u)} من قارئ متقن (5 مرات)`, h: 'قبل الحفظ، لتتأكد من سلامة القراءة' });
    if (u.prev) {
      items.push({ k: 'prev5', t: 'مراجعة نصاب الأمس (5 مرات حدرًا)', h: `قبل حفظ الجديد — ${pageLabel(u.prev)}` });
    }
    items.push({ k: 'rep50', t: 'القراءة والتكرار غيبًا (50 مرة على الأقل)', h: 'كل آية 50 مرة ثم اجمعها مع ما قبلها 5 مرات، بصوت مسموع وبالنظر إلى المصحف' });
    if (u.before > 0) {
      const long = Math.ceil(u.before / 40) > 1;
      items.push({ k: 'review', t: 'المراجعة: سرد المحفوظ السابق من أول الفاتحة', h: reviewHint(u.before, 40, wi, d) + (long ? ' — بحدّ أقصى جزأين يوميًا' : '') });
    }
    items.push({ k: 'recite', t: 'سرد المحفوظ الجديد (5 مرات متتالية بلا خطأ)', h: 'إن أخطأت فأعد الحفظ 10 مرات أو أكثر ثم أعد السرد' });
    if (d < 4 || w.hasNextWeek) {
      items.push({ k: 'link', t: d < 4 ? 'الربط: حفظ أول آية من نصاب الغد' : 'الربط: حفظ أول آية من نصاب الأحد القادم' });
    }
    return { id: d, dayIdx: d, name: DAY_NAMES[d], badge: 'ص ' + u.page, sub: unitSub(u), items };
  }

  function friDay(wi, w) {
    const a = w.units[0], b = w.units[4];
    return {
      id: 5, dayIdx: 5, name: DAY_NAMES[5], soft: true, badge: 'مراجعة أسبوعية', sub: null,
      items: [
        { k: 'rep', t: 'سرد محفوظ الأسبوع كاملًا (من 5 إلى 10 مرات)', h: `من ${startDesc(a)} إلى ${endDesc(b)} — غيبًا أو نظرًا في المصحف، وكلما زاد كان أحسن` },
        { k: 'fix', t: 'تصحيح أخطاء السرد بتكرار الموضع الذي أخطأتَ فيه (50 مرة)' },
        { k: 'peer', t: 'العرض على رفيق من الأقارب أو الصحبة الصالحة' },
        { k: 'form', t: 'ملء استمارة المتابعة الأسبوعية', h: 'تُوضع في قناة حفظ القرآن كل جمعة وتبقى مفتوحة 24 ساعة' }
      ]
    };
  }

  function satDay() {
    return {
      id: 6, dayIdx: 6, name: DAY_NAMES[6], soft: true, badge: 'تثبيت', sub: null,
      items: [
        { k: 'loose', t: 'تثبيت النصاب المتفلّت (إعادة حفظه من جديد)' },
        { k: 'hear', t: 'سماع قارئ متقن للنصاب المراد تثبيته' },
        { k: 'old', t: 'الإتيان بالقديم كله غيبًا', h: 'يوم الجمعة أو السبت، ويمكن تقسيمه على أوقات الصلاة وليس في مجلس واحد' }
      ]
    };
  }

  function examCard(w) {
    return {
      id: 'x', dayIdx: null, name: 'الاختبار التراكمي', wide: true, exam: true,
      badge: `من الفاتحة إلى ص ${w.endPage}`, sub: null,
      items: [
        { k: 'contact', t: 'التواصل مع مشرف/ة مجموعة الاختبار وتأكيد الموعد', h: 'الأعذار وطلبات تغيير الوقت تكون عن طريقه' },
        { k: 'done', t: `أجريتُ الاختبار الصوتي التراكمي (من أول الفاتحة إلى ص ${w.endPage})`, h: 'يحق للشيخ/ة طلب فتح الكاميرا في أول الاختبار أو وسطه' }
      ]
    };
  }

  function examReviewDay(wi, w, d) {
    return {
      id: d, dayIdx: d, name: DAY_NAMES[d], badge: 'مراجعة', sub: 'استعداد للاختبار',
      items: [
        { k: 'rev3', t: 'مراجعة المحفوظ بمقدار 3 أجزاء على الأقل (حدرًا)', h: reviewHint(w.endPage, 60, wi, d) + ' — غيبًا أو نظرًا في المصحف' },
        { k: 'fix', t: 'تكرار مواضع الخطأ (50 مرة للموضع الواحد)' }
      ]
    };
  }

  function friExam() {
    return {
      id: 5, dayIdx: 5, name: DAY_NAMES[5], soft: true, badge: 'مراجعة', sub: null,
      items: [
        { k: 'weak', t: 'مراجعة المواضع الضعيفة وتصحيح أخطاء السرد (50 مرة للموضع)' },
        { k: 'peer', t: 'العرض على رفيق من الأقارب أو الصحبة الصالحة' },
        { k: 'form', t: 'ملء استمارة المتابعة الأسبوعية', h: 'تُوضع في قناة حفظ القرآن كل جمعة وتبقى مفتوحة 24 ساعة' }
      ]
    };
  }

  function buildModel(wi) {
    const w = WEEKS[wi];
    const days = [];
    if (w.type === 'mem') {
      w.units.forEach((u, d) => days.push(memDay(wi, w, u, d)));
      days.push(friDay(wi, w));
      days.push(satDay());
    } else {
      days.push(examCard(w));
      for (let d = 0; d < 5; d++) days.push(examReviewDay(wi, w, d));
      days.push(friExam());
      days.push(satDay());
    }
    return days;
  }

  const MODEL = WEEKS.map((_, i) => buildModel(i));
  const TOTAL = MODEL.map(days => days.reduce((n, d) => n + d.items.length, 0));
  const GRAND_TOTAL = TOTAL.reduce((a, b) => a + b, 0);

  /* ---------------------- الحالة والتخزين ---------------------- */
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const s = raw ? JSON.parse(raw) : {};
      return { checks: s.checks || {}, scores: s.scores || {} };
    } catch (e) {
      return { checks: {}, scores: {} };
    }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* التخزين غير متاح */ }
  }

  function progress() {
    const done = new Array(WEEKS.length).fill(0);
    let total = 0;
    for (const k in state.checks) {
      const i = parseInt(k, 10);
      if (i >= 0 && i < done.length) { done[i]++; total++; }
    }
    return { done, total };
  }

  /* ---------------------- اليوم الحالي ---------------------- */
  function todayInfo() {
    const diff = dayDiff(START, new Date());
    if (diff < 0) return { st: 'before', days: -diff };
    const wi = Math.floor(diff / 7);
    if (wi >= WEEKS.length) return { st: 'after' };
    return { st: 'in', wi, d: diff % 7 };
  }
  function expectedPage(t) {
    if (t.st === 'before') return 0;
    if (t.st === 'after') return LAST_PAGE;
    const w = WEEKS[t.wi];
    if (w.type === 'mem') return t.d <= 4 ? w.units[t.d].page : w.units[4].page;
    return w.endPage;
  }

  let cur = (function () {
    const t = todayInfo();
    if (t.st === 'in') return t.wi;
    return t.st === 'after' ? WEEKS.length - 1 : 0;
  })();
  let view = 'week';

  /* ---------------------- العرض: الملخص ---------------------- */
  function renderSummary() {
    const p = progress();
    const t = todayInfo();
    const pct = GRAND_TOTAL ? (p.total / GRAND_TOTAL * 100) : 0;
    const memLastWeek = WEEKS.length - 2;
    const khatm = addDays(START, memLastWeek * 7 + 4);

    let weekLine, weekSub;
    if (t.st === 'in') {
      const i = stageInfo(WEEKS[t.wi].stage);
      weekLine = `${t.wi + 1} / ${WEEKS.length}`;
      weekSub = `المستوى ${i.level} · ${stageName(i)}`;
    } else if (t.st === 'before') {
      weekLine = 'لم نبدأ بعد';
      weekSub = `تبدأ الرحلة بعد ${t.days} يومًا`;
    } else {
      weekLine = 'انتهى البرنامج';
      weekSub = 'الحمد لله';
    }

    const exp = expectedPage(t);
    const remain = t.st === 'in' ? Math.max(0, memLastWeek - t.wi) : (t.st === 'before' ? memLastWeek + 1 : 0);

    $('summary').innerHTML =
      `<div class="stat"><span class="k">الأسبوع الحالي</span><b>${weekLine}</b><small>${weekSub}</small></div>` +
      `<div class="stat"><span class="k">إنجازك حتى الآن</span><b>${pct.toFixed(1)}٪</b>` +
      `<div class="bar"><i style="width:${pct}%"></i></div><small>${num(p.total)} من ${num(GRAND_TOTAL)} مهمة</small></div>` +
      `<div class="stat"><span class="k">المقرَّر حتى اليوم</span><b>${exp ? 'ص ' + exp : '—'}</b><small>من ${LAST_PAGE} صفحة، حسب الجدول</small></div>` +
      `<div class="stat"><span class="k">ختم الحفظ المتوقع</span><b>${fmtFull.format(khatm)}</b><small>${remain ? 'بعد ' + num(remain) + ' أسبوعًا تقريبًا' : 'أتممتَ الحفظ'}</small></div>`;
  }

  /* ---------------------- العرض: الأسبوع ---------------------- */
  function cardHTML(wi, day, todayD) {
    const checked = day.items.filter(it => state.checks[`${wi}.${day.id}.${it.k}`]).length;
    const total = day.items.length;
    const isToday = todayD !== null && day.dayIdx === todayD;
    const date = day.dayIdx === null ? 'خلال أسبوع الاختبار' : fmtFull.format(addDays(START, wi * 7 + day.dayIdx));
    const lis = day.items.map(it => {
      const key = `${wi}.${day.id}.${it.k}`;
      return `<li><label class="item"><input type="checkbox" data-key="${key}"${state.checks[key] ? ' checked' : ''}>` +
        `<span class="txt">${it.t}${it.h ? `<small>${it.h}</small>` : ''}</span></label></li>`;
    }).join('');

    let extra = '';
    if (day.exam) {
      const v = state.scores[wi];
      extra = `<div class="score"><label for="score-${wi}">درجة الاختبار (من 20)</label>` +
        `<input type="number" id="score-${wi}" data-score="${wi}" min="0" max="20" step="0.5" inputmode="decimal" value="${v === undefined ? '' : v}">` +
        `<span class="${v === undefined ? 'verdict' : verdictClass(v)}" id="verdict-${wi}">${verdictHTML(wi, v)}</span></div>`;
    }

    const cls = ['day', day.soft ? 'soft' : '', day.wide ? 'wide' : '', isToday ? 'is-today' : '', checked === total ? 'is-done' : '']
      .filter(Boolean).join(' ');
    return `<article class="${cls}">` +
      `<div class="day-head"><div><h3 class="day-name">${day.name}${isToday ? '<span class="today-tag">اليوم</span>' : ''}</h3>` +
      `<span class="day-date">${date}</span></div><span class="badge">${day.badge}</span></div>` +
      (day.sub ? `<p class="day-sub">${day.sub}</p>` : '') +
      `<ul class="items">${lis}</ul>${extra}` +
      `<div class="day-foot"><div class="count"><span class="c-done">${checked}</span> / <span class="c-total">${total}</span></div></div>` +
      `</article>`;
  }

  function verdictHTML(wi, v) {
    if (v === undefined || v === '' || isNaN(v)) return '';
    const last = WEEKS[wi].stage === TOTAL_STAGES;
    if (v >= PASS_MARK) return last ? 'ناجح — ختمتَ القرآن حفظًا، والحمد لله' : 'ناجح — أكمل حفظ النصاب الجديد';
    return 'دون 12 من 20 — أعد حفظ نفس النصاب واختبر فيه مجددًا قبل أن تتجاوزه';
  }
  function verdictClass(v) { return v >= PASS_MARK ? 'verdict pass' : 'verdict fail'; }

  function bannerHTML(wi) {
    const w = WEEKS[wi];
    const info = stageInfo(w.stage);
    if (w.type === 'exam') {
      return `<p><strong>أسبوع الاختبار التراكمي:</strong> من أول الفاتحة إلى ص ${w.endPage}. لا يوجد حفظ جديد، بل مراجعة المحفوظ كله بمقدار 3 أجزاء على الأقل يوميًا (حدرًا).</p>` +
        `<p>النجاح: ${PASS_MARK} من 20 (60٪) فما فوق؛ ومن أخذ أقل يعيد حفظ نفس النصاب ويختبر فيه مجددًا.</p>`;
    }
    const a = w.units[0], b = w.units[4];
    const quota = w.stage === TOTAL_STAGES ? 'آخر أسبوع في الحفظ' : '2.5 وجه';
    let html = `<p><strong>نصاب هذا الأسبوع:</strong> من ${startDesc(a)} إلى ${endDesc(b)} (${quota}). كرّر كل صفحة 50 مرة على الأقل، واربط نهاية كل صفحة ببداية التالية.</p>`;
    if (AYAT[w.stage]) {
      html += `<p><strong>الآيات:</strong> ${AYAT[w.stage][w.wk - 1]}</p>`;
    } else {
      html += `<p><strong>السور في هذه الصفحات (تقريبًا):</strong> ${surahsIn(a.page, b.page).join('، ')}</p>`;
    }
    if (LEVELS[info.level].ext) {
      html += `<p class="ext-note">هذا الأسبوع من الامتداد المقترح بعد ص 301: لم يرد في ملف المعهد، وأُكمل بنفس الوتيرة حتى الختم.</p>`;
    }
    return html;
  }

  function renderWeek() {
    const wi = cur, w = WEEKS[wi], info = stageInfo(w.stage), t = todayInfo();
    const todayD = (t.st === 'in' && t.wi === wi) ? t.d : null;

    $('wkTitle').textContent = w.type === 'exam'
      ? `المستوى ${info.level} — ${stageName(info)} — أسبوع الاختبار`
      : `المستوى ${info.level} — ${stageName(info)} — الأسبوع ${w.wk}`;
    const s0 = addDays(START, wi * 7), s1 = addDays(START, wi * 7 + 6);
    $('wkSub').textContent = `الأسبوع ${wi + 1} من ${WEEKS.length} · ${fmtDM.format(s0)} – ${fmtFull.format(s1)}`;

    $('prevBtn').disabled = wi === 0;
    $('nextBtn').disabled = wi === WEEKS.length - 1;

    // اختيار المرحلة
    const sel = $('stageSel');
    if (!sel.options.length) {
      let html = '';
      for (let lv = 1; lv <= 7; lv++) {
        html += `<optgroup label="المستوى ${lv}${LEVELS[lv].ext ? ' (امتداد مقترح)' : ''}">`;
        for (let s = 1; s <= TOTAL_STAGES; s++) {
          const i = stageInfo(s);
          if (i.level !== lv) continue;
          html += `<option value="${s}">${stageName(i)} — ص ${i.from}–${i.to}</option>`;
        }
        html += '</optgroup>';
      }
      sel.innerHTML = html;
    }
    sel.value = String(w.stage);

    // أزرار أسابيع المرحلة
    const p = progress();
    let pills = '';
    for (let i = 0; i < stageWeekCount(w.stage); i++) {
      const idx = stageBase(w.stage) + i;
      const isExam = WEEKS[idx].type === 'exam';
      const done = TOTAL[idx] && p.done[idx] === TOTAL[idx];
      pills += `<button type="button" class="pill${isExam ? ' is-exam' : ''}${done ? ' is-done' : ''}${idx === wi ? ' is-active' : ''}" data-week="${idx}" ` +
        `title="${isExam ? 'أسبوع الاختبار' : 'الأسبوع ' + (i + 1)}" aria-label="${isExam ? 'أسبوع الاختبار' : 'الأسبوع ' + (i + 1)}">${i + 1}</button>`;
    }
    $('pills').innerHTML = pills;

    $('banner').innerHTML = bannerHTML(wi);
    $('grid').innerHTML = MODEL[wi].map(day => cardHTML(wi, day, todayD)).join('');
  }

  /* ---------------------- العرض: خريطة الرحلة ---------------------- */
  function renderMap() {
    const p = progress();
    const t = todayInfo();
    const curStage = t.st === 'in' ? WEEKS[t.wi].stage : null;
    let html = '';
    for (let lv = 1; lv <= 7; lv++) {
      html += `<div class="level-block"><div class="level-head"><h3>المستوى ${lv}</h3><span>${LEVELS[lv].desc}</span>` +
        (LEVELS[lv].ext ? '<span class="tag-ext">امتداد مقترح</span>' : '') + '</div><div class="tiles">';
      for (let s = 1; s <= TOTAL_STAGES; s++) {
        const i = stageInfo(s);
        if (i.level !== lv) continue;
        let sumDone = 0, sumTotal = 0, weeks = '';
        for (let k = 0; k < stageWeekCount(s); k++) {
          const idx = stageBase(s) + k;
          sumDone += p.done[idx]; sumTotal += TOTAL[idx];
          const cls = [WEEKS[idx].type === 'exam' ? 'exam' : '', p.done[idx] === 0 ? '' : (p.done[idx] === TOTAL[idx] ? 'full' : 'part'),
            (t.st === 'in' && t.wi === idx) ? 'now' : ''].filter(Boolean).join(' ');
          weeks += `<i class="${cls}"></i>`;
        }
        const complete = sumTotal > 0 && sumDone === sumTotal;
        html += `<button type="button" class="tile${s === curStage ? ' is-current' : ''}${complete ? ' is-complete' : ''}" data-stage="${s}">` +
          `<div class="t-top"><b>${stageName(i)}</b><span>ص ${i.from}–${i.to}</span></div>` +
          `<div class="t-cum">${i.cum}</div><div class="t-weeks">${weeks}</div></button>`;
      }
      html += '</div></div>';
    }
    $('mapView').innerHTML = html;
  }

  function render() {
    renderSummary();
    if (view === 'week') renderWeek(); else renderMap();
  }

  function setView(v) {
    view = v;
    $('weekView').hidden = v !== 'week';
    $('mapView').hidden = v !== 'map';
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.view === v));
    render();
  }

  function goToWeek(i, scroll) {
    cur = Math.max(0, Math.min(WEEKS.length - 1, i));
    setView('week');
    if (scroll) {
      const el = document.querySelector('.day.is-today');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  /* ---------------------- الأحداث ---------------------- */
  document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  $('prevBtn').addEventListener('click', () => goToWeek(cur - 1));
  $('nextBtn').addEventListener('click', () => goToWeek(cur + 1));
  $('todayBtn').addEventListener('click', () => {
    const t = todayInfo();
    goToWeek(t.st === 'in' ? t.wi : (t.st === 'after' ? WEEKS.length - 1 : 0), true);
  });
  $('stageSel').addEventListener('change', e => goToWeek(stageBase(Number(e.target.value))));
  $('pills').addEventListener('click', e => {
    const b = e.target.closest('.pill');
    if (b) goToWeek(Number(b.dataset.week));
  });
  $('mapView').addEventListener('click', e => {
    const b = e.target.closest('.tile');
    if (b) goToWeek(stageBase(Number(b.dataset.stage)));
  });

  $('grid').addEventListener('change', e => {
    const inp = e.target;
    if (!inp.matches('input[type="checkbox"][data-key]')) return;
    if (inp.checked) state.checks[inp.dataset.key] = 1; else delete state.checks[inp.dataset.key];
    saveState();
    const card = inp.closest('.day');
    const boxes = card.querySelectorAll('input[type="checkbox"]');
    const n = card.querySelectorAll('input[type="checkbox"]:checked').length;
    card.querySelector('.c-done').textContent = n;
    card.classList.toggle('is-done', n === boxes.length);
    renderSummary();
    const p = progress();
    document.querySelectorAll('#pills .pill').forEach(b => {
      const idx = Number(b.dataset.week);
      b.classList.toggle('is-done', TOTAL[idx] > 0 && p.done[idx] === TOTAL[idx]);
    });
  });

  $('grid').addEventListener('input', e => {
    const inp = e.target;
    if (!inp.matches('input[data-score]')) return;
    const wi = Number(inp.dataset.score);
    const raw = inp.value.trim();
    const out = $('verdict-' + wi);
    if (raw === '' || isNaN(Number(raw))) {
      delete state.scores[wi];
      out.textContent = ''; out.className = 'verdict';
    } else {
      const v = Math.max(0, Math.min(20, Number(raw)));
      state.scores[wi] = v;
      out.textContent = verdictHTML(wi, v); out.className = verdictClass(v);
    }
    saveState();
  });

  $('resetWeekBtn').addEventListener('click', () => {
    if (!confirm('تصفير كل العلامات في هذا الأسبوع؟')) return;
    Object.keys(state.checks).forEach(k => { if (parseInt(k, 10) === cur) delete state.checks[k]; });
    delete state.scores[cur];
    saveState(); render();
  });

  $('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ app: 'bina-tracker', v: 1, checks: state.checks, scores: state.scores })], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bina-progress.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const o = JSON.parse(r.result);
        if (!o || typeof o.checks !== 'object') throw new Error('bad');
        const checks = {}, scores = {};
        Object.keys(o.checks).forEach(k => { if (/^\d+\.[0-9x]+\.[a-z0-9]+$/i.test(k)) checks[k] = 1; });
        Object.keys(o.scores || {}).forEach(k => { const v = Number(o.scores[k]); if (/^\d+$/.test(k) && !isNaN(v)) scores[k] = Math.max(0, Math.min(20, v)); });
        if (!confirm('سيحلّ هذا التقدّم المستورد محل تقدّمك الحالي. متابعة؟')) return;
        state = { checks, scores };
        saveState(); render();
      } catch (err) {
        alert('تعذّر قراءة الملف. تأكد أنه ملف تقدّم صدّرته من هذا الموقع.');
      }
      e.target.value = '';
    };
    r.readAsText(f);
  });
  $('resetAllBtn').addEventListener('click', () => {
    if (!confirm('سيُحذف كل تقدّمك المسجّل نهائيًا. هل أنت متأكد؟')) return;
    state = { checks: {}, scores: {} };
    saveState(); render();
  });

  /* ---------------------- انطلاق ---------------------- */
  setView('week');
})();
