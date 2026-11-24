/**
 * ExamSaathi Streak Module
 * Daily study streak tracking using activity dates.
 */
const Streak = (() => {
  const KEY = 'streak';
  const ACTIVITY_KEY = 'activity_dates';

  // YYYY-MM-DD in the device's LOCAL timezone. (toISOString() is UTC, which
  // put activity between 00:00 and 05:30 IST on the previous day.)
  function dateStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function todayStr() {
    return dateStr(new Date());
  }

  function getData() {
    return Storage.get(KEY, { current: 0, best: 0, lastActive: null });
  }

  function getActivityDates() {
    return Storage.get(ACTIVITY_KEY, []);
  }

  function markToday() {
    const today = todayStr();
    const data = getData();
    const dates = getActivityDates();

    if (data.lastActive === today) return data; // already counted

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = dateStr(yesterday);

    const newCurrent = data.lastActive === yesterdayStr ? data.current + 1 : 1;
    const newBest = Math.max(data.best, newCurrent);

    const updated = { current: newCurrent, best: newBest, lastActive: today };
    Storage.set(KEY, updated);

    if (!dates.includes(today)) {
      dates.push(today);
      // Keep last 365 days only
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 365);
      const filtered = dates.filter(d => new Date(d) >= cutoff);
      Storage.set(ACTIVITY_KEY, filtered);
    }

    return updated;
  }

  function isTodayDone() {
    return getData().lastActive === todayStr();
  }

  // Streak to display: the stored streak only counts while the last active
  // day is today or yesterday; after a missed day it is 0.
  function getCurrent() {
    const data = getData();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (data.lastActive === todayStr() || data.lastActive === dateStr(yesterday)) ? data.current : 0;
  }

  function getCalendarData(months = 3) {
    const dates = new Set(getActivityDates());
    const result = [];
    const today = new Date();

    for (let i = months * 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const str = dateStr(d);
      result.push({ date: str, active: dates.has(str) });
    }
    return result;
  }

  return { markToday, getData, getCurrent, isTodayDone, getCalendarData, getActivityDates, dateStr };
})();

window.Streak = Streak;
