/**
 * ExamSaathi User Auth Module
 * Local user registration and profile management (no server).
 */
const Auth = (() => {
  const USER_KEY = 'user';

  function getUser() {
    return Storage.get(USER_KEY, null);
  }

  function isLoggedIn() {
    return !!getUser();
  }

  function register(name, lang = 'hi') {
    if (!name || !name.trim()) return { ok: false, error: 'name_required' };
    const user = {
      id: 'u_' + Date.now(),
      name: name.trim(),
      lang,
      createdAt: new Date().toISOString(),
      totalQuestions: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalTests: 0,
    };
    Storage.set(USER_KEY, user);
    State.update({ user, isLoggedIn: true, lang });
    I18n.setLang(lang);
    return { ok: true, user };
  }

  function updateProfile(updates) {
    const user = getUser();
    if (!user) return false;
    const updated = { ...user, ...updates };
    Storage.set(USER_KEY, updated);
    State.set('user', updated);
    if (updates.lang) {
      I18n.setLang(updates.lang);
      State.set('lang', updates.lang);
    }
    return true;
  }

  function recordAttempt({ correct, wrong, skipped }) {
    const user = getUser();
    if (!user) return;
    user.totalQuestions = (user.totalQuestions || 0) + correct + wrong + skipped;
    user.totalCorrect = (user.totalCorrect || 0) + correct;
    user.totalWrong = (user.totalWrong || 0) + wrong;
    user.totalTests = (user.totalTests || 0) + 1;
    Storage.set(USER_KEY, user);
    State.set('user', user);
  }

  function resetAll() {
    Storage.clear(); // wipe all app data
  }

  function loadUserToState() {
    const user = getUser();
    if (user) {
      State.update({ user, isLoggedIn: true, lang: user.lang || 'hi' });
      I18n.setLang(user.lang || 'hi');
    }
  }

  return { getUser, isLoggedIn, register, updateProfile, recordAttempt, resetAll, loadUserToState };
})();

window.Auth = Auth;
