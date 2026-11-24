/**
 * ExamSaathi Bookmarks Module
 * Save/unsave questions and collect wrong answers.
 */
const Bookmarks = (() => {
  const SAVED_KEY = 'bookmarks_saved';
  const WRONG_KEY = 'bookmarks_wrong';

  function getSaved() { return Storage.get(SAVED_KEY, []); }
  function getWrong() { return Storage.get(WRONG_KEY, []); }

  function isSaved(qId) { return getSaved().some(q => q.id === qId); }

  function toggleSave(question) {
    const list = getSaved();
    const idx = list.findIndex(q => q.id === question.id);
    if (idx >= 0) {
      list.splice(idx, 1);
      Storage.set(SAVED_KEY, list);
      return false;
    } else {
      list.unshift({ ...question, savedAt: new Date().toISOString() });
      if (list.length > 500) list.splice(500);
      Storage.set(SAVED_KEY, list);
      return true;
    }
  }

  function addWrong(question, userAnswer) {
    const list = getWrong();
    // Don't duplicate; update if already there
    const idx = list.findIndex(q => q.id === question.id);
    const entry = { ...question, userAnswer, wrongAt: new Date().toISOString() };
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    if (list.length > 500) list.splice(500);
    Storage.set(WRONG_KEY, list);
  }

  function removeWrong(qId) {
    const list = getWrong().filter(q => q.id !== qId);
    Storage.set(WRONG_KEY, list);
  }

  function clearSaved() { Storage.set(SAVED_KEY, []); }
  function clearWrong() { Storage.set(WRONG_KEY, []); }

  function getCount() {
    return { saved: getSaved().length, wrong: getWrong().length };
  }

  return { getSaved, getWrong, isSaved, toggleSave, addWrong, removeWrong, clearSaved, clearWrong, getCount };
})();

window.Bookmarks = Bookmarks;
