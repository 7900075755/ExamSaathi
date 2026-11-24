/** ExamSaathi CategoryManager — STUB. Admin disabled in public build. */
const CategoryManager = (() => {
  const _warn = () => console.warn('[CategoryManager] Admin disabled in public build.');
  return { getAll: _warn, add: _warn, update: _warn, remove: _warn, reorder: _warn };
})();
window.CategoryManager = CategoryManager;
