/**
 * ExamSaathi Analytics Module
 * Track and retrieve performance data per category and over time.
 */
const Analytics = (() => {
  const HISTORY_KEY = 'results_history';
  const CAT_STATS_KEY = 'cat_stats';

  function getHistory() { return Storage.get(HISTORY_KEY, []); }
  function getCatStats() { return Storage.get(CAT_STATS_KEY, {}); }

  function saveResult(result) {
    // result: { type, testId, testName, category, correct, wrong, skipped, total, marks, timeTaken, questions }
    const history = getHistory();
    const entry = {
      ...result,
      id: 'r_' + Date.now(),
      date: new Date().toISOString(),
    };
    // Don't store full question data in history to save space
    delete entry.questions;
    history.unshift(entry);
    if (history.length > 100) history.splice(100);
    Storage.set(HISTORY_KEY, history);

    // Update category stats
    updateCatStats(result);

    return entry;
  }

  function updateCatStats(result) {
    const stats = getCatStats();
    const cats = result.categoryBreakdown || [{ category: result.category || 'mixed', correct: result.correct, wrong: result.wrong, skipped: result.skipped }];
    cats.forEach(({ category, correct, wrong, skipped }) => {
      if (!category) return;
      if (!stats[category]) stats[category] = { attempted: 0, correct: 0, wrong: 0 };
      stats[category].attempted += correct + wrong + skipped;
      stats[category].correct += correct;
      stats[category].wrong += wrong;
    });
    Storage.set(CAT_STATS_KEY, stats);
  }

  function getOverallStats() {
    const history = getHistory();
    if (!history.length) return { totalTests: 0, totalQuestions: 0, totalCorrect: 0, accuracy: 0 };
    const totalQuestions = history.reduce((s, r) => s + (r.total || 0), 0);
    const totalCorrect = history.reduce((s, r) => s + (r.correct || 0), 0);
    return {
      totalTests: history.length,
      totalQuestions,
      totalCorrect,
      accuracy: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    };
  }

  function getAccuracyByCategory() {
    const stats = getCatStats();
    return Object.entries(stats).map(([cat, s]) => ({
      category: cat,
      attempted: s.attempted,
      correct: s.correct,
      accuracy: s.attempted ? Math.round((s.correct / s.attempted) * 100) : 0,
    })).sort((a, b) => b.accuracy - a.accuracy);
  }

  function getRecentHistory(limit = 10) {
    return getHistory().slice(0, limit);
  }

  function clearAll() {
    Storage.set(HISTORY_KEY, []);
    Storage.set(CAT_STATS_KEY, {});
  }

  return { saveResult, getHistory, getCatStats, getOverallStats, getAccuracyByCategory, getRecentHistory, clearAll };
})();

window.Analytics = Analytics;
