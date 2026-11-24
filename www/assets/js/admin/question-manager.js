/** ExamSaathi QuestionManager — STUB. Admin disabled in public build. */
const QuestionManager = (() => {
  const _warn = () => console.warn('[QuestionManager] Admin disabled in public build.');
  return { getAll: _warn, getById: _warn, add: _warn, update: _warn, remove: _warn, importCSV: _warn };
})();
window.QuestionManager = QuestionManager;
