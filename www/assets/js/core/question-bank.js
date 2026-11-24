/**
 * ExamSaathi Question Bank
 * Loads data/*.json at startup, converts each question from the bilingual
 * data format into the flat format the page scripts use, and stores the
 * result in localStorage['es_questions'] (read synchronously by pages).
 *
 * Data format (data/*.json):
 *   { id, category:'haryana-gk', topic, lang:{en,hi}, options:{en:[],hi:[]},
 *     correct, explanation:{en,hi}, difficulty, tier, tags }
 * Page format (es_questions):
 *   { id, category:'haryana', categoryId:'haryana-gk', topic, text, textEn,
 *     options, optionsEn, correctIndex, explanation, explanationEn,
 *     difficulty, tier, tags }
 */
const QuestionBank = (() => {
  const KEY = 'es_questions';

  // data file id -> short id used by the page scripts
  const CATEGORY_FILES = {
    'haryana-gk':         'haryana',
    'general-knowledge':  'gk',
    'general-science':    'science',
    'mathematics':        'math',
    'reasoning':          'reasoning',
    'english':            'english',
    'hindi-grammar':      'hindi',
    'computer-knowledge': 'computer',
    'current-affairs':    'current',
  };

  function pick(obj, primary, fallback) {
    if (obj == null) return undefined;
    if (typeof obj === 'string' || Array.isArray(obj)) return obj;
    return obj[primary] != null ? obj[primary] : obj[fallback];
  }

  function normalize(q) {
    if (!q || typeof q !== 'object') return null;
    const lang = q.lang || {};
    return {
      id:            q.id,
      category:      CATEGORY_FILES[q.category] || q.category,
      categoryId:    q.category,
      topic:         q.topic || '',
      text:          pick(lang, 'hi', 'en') || q.text || '',
      textEn:        pick(lang, 'en', 'hi') || q.textEn || '',
      options:       pick(q.options, 'hi', 'en') || [],
      optionsEn:     pick(q.options, 'en', 'hi') || [],
      correctIndex:  typeof q.correct === 'number' ? q.correct : q.correctIndex,
      explanation:   pick(q.explanation, 'hi', 'en') || '',
      explanationEn: pick(q.explanation, 'en', 'hi') || '',
      difficulty:    q.difficulty || 'medium',
      tier:          q.tier || 'free',
      tags:          q.tags || [],
    };
  }

  function isValid(n) {
    return !!(n && n.id && n.text &&
      Array.isArray(n.options) && n.options.length >= 2 &&
      Number.isInteger(n.correctIndex) &&
      n.correctIndex >= 0 && n.correctIndex < n.options.length);
  }

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (e) { return []; }
  }

  function countByCategory() {
    const counts = {};
    getAll().forEach(q => { counts[q.category] = (counts[q.category] || 0) + 1; });
    return counts;
  }

  /* ===== MOCK TESTS (data/mock-tests.json) ===== */

  const MOCK_KEY = 'es_mock_tests';
  // Old short ids used by earlier links/cards
  const MOCK_ALIASES = {
    ssc: 'mock-ssc-cgl-demo', hssc: 'mock-hssc-clerk-demo', banking: 'mock-banking-ibps-po-demo',
  };

  function getMockTests() {
    try { return JSON.parse(localStorage.getItem(MOCK_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function getMockTest(id) {
    const tests = getMockTests();
    const realId = MOCK_ALIASES[id] || id;
    return tests.find(t => t.id === realId) || null;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /**
   * Pick questions for a mock test, section by section, from the bank.
   * If a section's category has fewer questions than required, all of
   * them are used (the result says how many were short).
   */
  function buildMockQuestions(test) {
    const all = getAll();
    const questions = [];
    const sections = [];
    let short = 0;
    (test.sections || []).forEach(sec => {
      const pool = shuffle(all.filter(q => q.categoryId === sec.category));
      const picked = pool.slice(0, sec.questions);
      short += Math.max(0, sec.questions - picked.length);
      sections.push({ id: sec.id, name: sec.name, category: sec.category, start: questions.length, count: picked.length });
      picked.forEach(q => questions.push(q));
    });
    return { questions, sections, short };
  }

  async function loadMockTests() {
    const res = await fetch('data/mock-tests.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const tests = (data.tests || []).filter(t => t && t.id && Array.isArray(t.sections));
    if (tests.length) localStorage.setItem(MOCK_KEY, JSON.stringify(tests));
    return tests.length;
  }

  async function loadFile(fileId) {
    const res = await fetch('data/' + fileId + '.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.questions || []);
  }

  /**
   * Fetch every category file and refresh es_questions.
   * Premium-tier questions are excluded (no purchase flow exists yet).
   * If a file fails to load (e.g. offline, not cached), the previously
   * stored questions for that category are kept.
   * Resolves to { ok, count, invalid, failed[] } — never rejects.
   */
  async function preload() {
    const fileIds = Object.keys(CATEGORY_FILES);
    const mockLoad = loadMockTests().catch(err => {
      console.warn('[QuestionBank] Could not load mock tests', err);
      return getMockTests().length;   // keep previously stored tests
    });
    const results = await Promise.all(fileIds.map(id =>
      loadFile(id).then(qs => ({ id, qs }), err => ({ id, err }))));
    const mockTests = await mockLoad;

    const previous = getAll();
    const out = [];
    const failed = [];
    let invalid = 0;

    results.forEach(r => {
      if (r.err) {
        failed.push(r.id);
        console.warn('[QuestionBank] Could not load', r.id, r.err);
        previous.filter(q => q.categoryId === r.id).forEach(q => out.push(q));
        return;
      }
      r.qs.forEach(raw => {
        const n = normalize(raw);
        if (!isValid(n)) { invalid++; return; }
        if (n.tier === 'premium') return;
        out.push(n);
      });
    });

    if (invalid) console.warn('[QuestionBank] Skipped', invalid, 'invalid question(s)');
    if (!out.length) return { ok: false, count: previous.length, invalid, failed, mockTests };

    try {
      localStorage.setItem(KEY, JSON.stringify(out));
    } catch (e) {
      console.error('[QuestionBank] Could not save questions:', e);
      return { ok: false, count: previous.length, invalid, failed, mockTests };
    }
    return { ok: true, count: out.length, invalid, failed, mockTests };
  }

  return {
    preload, getAll, countByCategory, normalize, isValid, shuffle, CATEGORY_FILES,
    getMockTests, getMockTest, buildMockQuestions,
  };
})();

window.QuestionBank = QuestionBank;
