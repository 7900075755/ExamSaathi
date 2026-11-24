/**
 * ExamSaathi CsvImporter — STUB. Admin disabled in public build.
 * Expected CSV columns (for future use):
 *   id, question_en, question_hi, opt_a_en, opt_b_en, opt_c_en, opt_d_en,
 *   opt_a_hi, opt_b_hi, opt_c_hi, opt_d_hi, correct (0-3), category,
 *   topic, difficulty, explanation_en, explanation_hi, tier
 */
const CsvImporter = (() => {
  const _warn = () => console.warn('[CsvImporter] Admin disabled in public build.');
  return { parse: _warn, validate: _warn, import: _warn, preview: _warn };
})();
window.CsvImporter = CsvImporter;
