/**
 * ExamSaathi Storage Module
 * Namespaced LocalStorage abstraction with error handling and versioning.
 */
const Storage = (() => {
  const NS = 'es_';
  const VERSION_KEY = NS + 'db_version';
  const CURRENT_VERSION = 2;

  function key(k) { return NS + k; }

  function get(k, fallback = null) {
    try {
      const raw = localStorage.getItem(key(k));
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function set(k, value) {
    try {
      localStorage.setItem(key(k), JSON.stringify(value));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('[Storage] Quota exceeded. Clearing old data.');
        clearOldCache();
        try {
          localStorage.setItem(key(k), JSON.stringify(value));
          return true;
        } catch { return false; }
      }
      return false;
    }
  }

  function remove(k) {
    try { localStorage.removeItem(key(k)); return true; }
    catch { return false; }
  }

  function exists(k) {
    return localStorage.getItem(key(k)) !== null;
  }

  function getAll(prefix = '') {
    const result = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS + prefix)) {
        const shortKey = k.slice(NS.length);
        try { result[shortKey] = JSON.parse(localStorage.getItem(k)); }
        catch { result[shortKey] = localStorage.getItem(k); }
      }
    }
    return result;
  }

  function clear(prefix = '') {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS + prefix)) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
  }

  function clearOldCache() {
    // Remove cached question files first (largest items)
    clear('cache_');
  }

  function getStorageSize() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS)) {
        total += (localStorage.getItem(k) || '').length * 2;
      }
    }
    return total;
  }

  function migrate() {
    const v = get('db_version', 0);
    if (v < 2) migrateV2();
    if (v < CURRENT_VERSION) set('db_version', CURRENT_VERSION);
  }

  // v2: page scripts used their own keys before they were switched to the
  // shared modules. Copy that data into the module keys (old keys are kept).
  function migrateV2() {
    const mergeById = (fromKey, toKey) => {
      const from = get(fromKey, []);
      if (!Array.isArray(from) || !from.length) return;
      const to = get(toKey, []);
      const seen = new Set(to.map(q => q && q.id));
      from.forEach(q => { if (q && !seen.has(q.id)) { to.push(q); seen.add(q.id); } });
      set(toKey, to);
    };
    mergeById('bookmarks', 'bookmarks_saved');
    mergeById('wrong_answers', 'bookmarks_wrong');

    // Old page totals -> user profile totals (only if the profile has none)
    const stats = get('stats', null);
    const user  = get('user', null);
    if (stats && user && !user.totalQuestions && stats.totalAnswered) {
      user.totalQuestions = stats.totalAnswered || 0;
      user.totalCorrect   = stats.totalCorrect  || 0;
      user.totalWrong     = Math.max(0, user.totalWrong || 0);
      user.totalTests     = user.totalTests || 0;
      set('user', user);
    }
  }

  // Run migration on load
  migrate();

  return { get, set, remove, exists, getAll, clear, getStorageSize, key };
})();

window.Storage = Storage;
