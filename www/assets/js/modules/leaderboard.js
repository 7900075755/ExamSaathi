/**
 * ExamSaathi Leaderboard Module
 * Local leaderboard. Architecture ready for future cloud sync.
 */
const Leaderboard = (() => {
  const KEY = 'leaderboard';

  function getAll() { return Storage.get(KEY, []); }

  function addEntry(entry) {
    // entry: { name, score, maxScore, testId, testName, accuracy, date }
    const list = getAll();
    list.push({ ...entry, id: 'lb_' + Date.now(), date: entry.date || new Date().toISOString() });
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.accuracy - a.accuracy;
    });
    if (list.length > 200) list.splice(200);
    Storage.set(KEY, list);
  }

  function getForTest(testId) {
    return getAll().filter(e => e.testId === testId).slice(0, 50);
  }

  function getRankedList(limit = 50) {
    return getAll().slice(0, limit).map((entry, i) => ({ ...entry, rank: i + 1 }));
  }

  function getUserRank(userName) {
    const list = getAll();
    const idx = list.findIndex(e => e.name === userName);
    return idx >= 0 ? idx + 1 : null;
  }

  function clear() { Storage.set(KEY, []); }

  return { getAll, addEntry, getForTest, getRankedList, getUserRank, clear };
})();

window.Leaderboard = Leaderboard;
