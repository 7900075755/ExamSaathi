/**
 * ExamSaathi Global State Manager
 * Simple observable state with subscriber pattern.
 */
const State = (() => {
  let _state = {
    // User
    user: null,            // { id, name, lang, createdAt }
    isLoggedIn: false,

    // App
    currentPage: 'splash',
    prevPage: null,
    lang: 'hi',            // 'hi' | 'en'
    isLoading: false,
    isOnline: navigator.onLine,

    // Quiz session (active)
    quizSession: null,

    // Cached data
    questions: {},         // { [category]: Question[] }
    mockTests: [],

    // UI state
    bottomNavVisible: true,
    headerVisible: true,
  };

  const subscribers = {};

  function get(key) {
    if (!key) return { ..._state };
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : null), _state);
  }

  function set(key, value) {
    const keys = key.split('.');
    if (keys.length === 1) {
      _state[key] = value;
    } else {
      let obj = _state;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof obj[keys[i]] !== 'object' || obj[keys[i]] === null) {
          obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    }
    _notify(key, value);
    // Also notify parent keys
    if (keys.length > 1) _notify(keys[0], get(keys[0]));
  }

  function update(partial) {
    Object.assign(_state, partial);
    Object.keys(partial).forEach(k => _notify(k, _state[k]));
  }

  function subscribe(key, fn) {
    if (!subscribers[key]) subscribers[key] = [];
    subscribers[key].push(fn);
    return () => { subscribers[key] = subscribers[key].filter(f => f !== fn); };
  }

  function _notify(key, value) {
    (subscribers[key] || []).forEach(fn => { try { fn(value); } catch (e) { console.error('[State]', e); } });
    (subscribers['*'] || []).forEach(fn => { try { fn(key, value); } catch (e) { console.error('[State]', e); } });
  }

  // Online/offline tracking
  window.addEventListener('online', () => set('isOnline', true));
  window.addEventListener('offline', () => set('isOnline', false));

  return { get, set, update, subscribe };
})();

window.State = State;
