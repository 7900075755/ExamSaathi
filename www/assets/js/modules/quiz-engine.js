/**
 * ExamSaathi Quiz Engine
 * Handles question loading, session state, scoring, and navigation
 * for daily quiz, topic practice, and mock tests.
 */
const QuizEngine = (() => {
  let session = null;

  /* ===== SESSION CREATION ===== */

  function createSession({ type, questions, config = {} }) {
    // type: 'daily' | 'practice' | 'mock'
    // config: { timeLimit (seconds), negativeMarking, marksPerQ, testId, testName, category }
    const shuffled = config.shuffle !== false ? shuffle([...questions]) : [...questions];
    session = {
      type,
      testId: config.testId || null,
      testName: config.testName || '',
      category: config.category || 'mixed',
      questions: shuffled,
      current: 0,
      answers: new Array(shuffled.length).fill(null), // null | option index (0-3)
      flags: new Array(shuffled.length).fill(false),
      startTime: Date.now(),
      endTime: null,
      config: {
        timeLimit: config.timeLimit || 0,
        negativeMarking: config.negativeMarking || 0,
        marksPerQ: config.marksPerQ || 1,
        ...config,
      },
      submitted: false,
    };
    State.set('quizSession', session);
    return session;
  }

  /* ===== NAVIGATION ===== */

  function getCurrentQ() {
    if (!session) return null;
    return session.questions[session.current];
  }

  function goTo(index) {
    if (!session) return;
    if (index >= 0 && index < session.questions.length) {
      session.current = index;
      State.set('quizSession', { ...session });
    }
  }

  function next() { goTo(session.current + 1); }
  function prev() { goTo(session.current - 1); }

  function isFirst() { return session && session.current === 0; }
  function isLast() { return session && session.current === session.questions.length - 1; }

  /* ===== ANSWERING ===== */

  function answer(optionIndex) {
    if (!session || session.submitted) return null;
    if (session.answers[session.current] !== null && session.type !== 'mock') return null; // lock after first answer in non-mock
    session.answers[session.current] = optionIndex;
    State.set('quizSession', { ...session });

    const q = getCurrentQ();
    const isCorrect = q.correct === optionIndex;
    if (!isCorrect && optionIndex !== null) {
      Bookmarks.addWrong(q, optionIndex);
    }
    return { isCorrect, correct: q.correct };
  }

  function toggleFlag() {
    if (!session) return;
    session.flags[session.current] = !session.flags[session.current];
    State.set('quizSession', { ...session });
  }

  /* ===== SCORING ===== */

  function calculateScore() {
    if (!session) return null;
    let correct = 0, wrong = 0, skipped = 0;
    let marks = 0;
    const breakdown = {};

    session.questions.forEach((q, i) => {
      const ans = session.answers[i];
      const cat = q.category || session.category;
      if (!breakdown[cat]) breakdown[cat] = { correct: 0, wrong: 0, skipped: 0 };

      if (ans === null) {
        skipped++;
        breakdown[cat].skipped++;
      } else if (ans === q.correct) {
        correct++;
        marks += session.config.marksPerQ;
        breakdown[cat].correct++;
      } else {
        wrong++;
        marks -= session.config.negativeMarking;
        breakdown[cat].wrong++;
      }
    });

    const total = session.questions.length;
    const maxMarks = total * session.config.marksPerQ;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const timeTaken = session.endTime ? Math.round((session.endTime - session.startTime) / 1000) : Math.round((Date.now() - session.startTime) / 1000);

    const categoryBreakdown = Object.entries(breakdown).map(([category, stats]) => ({ category, ...stats }));

    return {
      type: session.type,
      testId: session.testId,
      testName: session.testName,
      category: session.category,
      correct, wrong, skipped, total,
      marks: Math.max(0, Math.round(marks * 100) / 100),
      maxMarks,
      accuracy,
      timeTaken,
      categoryBreakdown,
      questions: session.questions,
      answers: session.answers,
    };
  }

  /* ===== SUBMISSION ===== */

  function submit() {
    if (!session || session.submitted) return null;
    session.submitted = true;
    session.endTime = Date.now();
    State.set('quizSession', { ...session });

    const result = calculateScore();
    Analytics.saveResult(result);
    Auth.recordAttempt(result);

    // Update leaderboard
    const user = Auth.getUser();
    if (user && result.maxMarks > 0) {
      Leaderboard.addEntry({
        name: user.name,
        score: result.marks,
        maxScore: result.maxMarks,
        testId: result.testId || result.type,
        testName: result.testName || result.type,
        accuracy: result.accuracy,
      });
    }

    // Update streak
    Streak.markToday();

    return result;
  }

  /* ===== QUERY ===== */

  function getSession() { return session; }

  function getProgress() {
    if (!session) return { answered: 0, flagged: 0, total: 0, current: 0 };
    return {
      answered: session.answers.filter(a => a !== null).length,
      flagged: session.flags.filter(Boolean).length,
      total: session.questions.length,
      current: session.current,
    };
  }

  function getAnswer(index) {
    if (!session) return null;
    return session.answers[index !== undefined ? index : session.current];
  }

  function isFlagged(index) {
    if (!session) return false;
    return session.flags[index !== undefined ? index : session.current];
  }

  function clearSession() { session = null; State.set('quizSession', null); }

  /* ===== HELPERS ===== */

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ===== QUESTION LOADING ===== */

  const _cache = {};

  async function loadCategory(categoryId) {
    if (_cache[categoryId]) return _cache[categoryId];
    if (State.get('questions')[categoryId]) {
      _cache[categoryId] = State.get('questions')[categoryId];
      return _cache[categoryId];
    }
    try {
      const res = await fetch(`data/${categoryId}.json`);
      if (!res.ok) throw new Error('Failed to load ' + categoryId);
      const data = await res.json();
      _cache[categoryId] = data.questions || data;
      const all = State.get('questions');
      all[categoryId] = _cache[categoryId];
      State.set('questions', all);
      return _cache[categoryId];
    } catch (e) {
      console.error('[QuizEngine] Load failed:', categoryId, e);
      return [];
    }
  }

  async function loadMultiple(categoryIds) {
    const results = await Promise.all(categoryIds.map(loadCategory));
    return results.flat();
  }

  async function loadAll() {
    const all = ['haryana-gk','general-knowledge','general-science','mathematics','reasoning','english','hindi-grammar','computer-knowledge','current-affairs'];
    return loadMultiple(all);
  }

  function getForDailyQuiz(count = 10) {
    const all = Object.values(_cache).flat();
    if (!all.length) return [];
    const free = all.filter(q => q.tier !== 'premium');
    const shuffled = shuffle([...free]);
    return shuffled.slice(0, count);
  }

  return {
    createSession, getCurrentQ, goTo, next, prev, isFirst, isLast,
    answer, toggleFlag, calculateScore, submit,
    getSession, getProgress, getAnswer, isFlagged, clearSession,
    loadCategory, loadMultiple, loadAll, getForDailyQuiz,
  };
})();

window.QuizEngine = QuizEngine;
