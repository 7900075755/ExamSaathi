/** ExamSaathi TestManager — STUB. Admin disabled in public build. */
const TestManager = (() => {
  const _warn = () => console.warn('[TestManager] Admin disabled in public build.');
  return { getAll: _warn, getById: _warn, create: _warn, update: _warn, remove: _warn };
})();
window.TestManager = TestManager;
