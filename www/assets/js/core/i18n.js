/**
 * ExamSaathi Internationalization Module
 * Hindi (default) and English support.
 */
const I18n = (() => {
  const strings = {
    // ===== APP =====
    app_name:               { hi: 'परीक्षा साथी', en: 'ExamSaathi' },
    app_tagline:            { hi: 'सरकारी परीक्षा की तैयारी, अब आसान', en: 'Smart Prep for Govt Exams' },

    // ===== NAV =====
    nav_home:               { hi: 'होम', en: 'Home' },
    nav_practice:           { hi: 'अभ्यास', en: 'Practice' },
    nav_tests:              { hi: 'टेस्ट', en: 'Tests' },
    nav_bookmarks:          { hi: 'सेव', en: 'Saved' },
    nav_profile:            { hi: 'प्रोफ़ाइल', en: 'Profile' },

    // ===== ONBOARDING =====
    onb_welcome:            { hi: 'स्वागत है!', en: 'Welcome!' },
    onb_subtitle:           { hi: 'SSC, HSSC, Banking परीक्षाओं की तैयारी करें', en: 'Prepare for SSC, HSSC & Banking exams' },
    onb_name_label:         { hi: 'आपका नाम', en: 'Your Name' },
    onb_name_placeholder:   { hi: 'नाम दर्ज करें', en: 'Enter your name' },
    onb_lang_label:         { hi: 'भाषा चुनें', en: 'Choose Language' },
    onb_btn_start:          { hi: 'शुरू करें', en: 'Get Started' },
    onb_name_required:      { hi: 'कृपया अपना नाम दर्ज करें', en: 'Please enter your name' },

    // ===== HOME =====
    home_greeting_morning:  { hi: 'सुप्रभात', en: 'Good Morning' },
    home_greeting_afternoon:{ hi: 'नमस्ते', en: 'Good Afternoon' },
    home_greeting_evening:  { hi: 'शुभ संध्या', en: 'Good Evening' },
    home_greeting_night:    { hi: 'शुभ रात्रि', en: 'Good Night' },
    home_daily_quiz:        { hi: 'आज का क्विज़', en: "Today's Quiz" },
    home_daily_quiz_sub:    { hi: '10 प्रश्न · सभी विषय', en: '10 Questions · All Topics' },
    home_start_quiz:        { hi: 'क्विज़ शुरू करें', en: 'Start Quiz' },
    home_quiz_done:         { hi: 'आज का क्विज़ पूरा!', en: "Today's Quiz Done!" },
    home_quiz_done_sub:     { hi: 'कल फिर आएं', en: 'Come back tomorrow' },
    home_subjects:          { hi: 'विषय', en: 'Subjects' },
    home_mock_tests:        { hi: 'मॉक टेस्ट', en: 'Mock Tests' },
    home_view_all:          { hi: 'सभी देखें', en: 'View All' },
    home_streak:            { hi: 'स्ट्रीक', en: 'Streak' },
    home_days:              { hi: 'दिन', en: 'Days' },
    home_total_qs:          { hi: 'कुल प्रश्न', en: 'Total Qs' },
    home_accuracy:          { hi: 'सटीकता', en: 'Accuracy' },
    home_rank:              { hi: 'रैंक', en: 'Rank' },
    home_continue:          { hi: 'जारी रखें', en: 'Continue' },

    // ===== CATEGORIES =====
    cat_haryana_gk:         { hi: 'हरियाणा GK', en: 'Haryana GK' },
    cat_general_knowledge:  { hi: 'सामान्य ज्ञान', en: 'General Knowledge' },
    cat_general_science:    { hi: 'सामान्य विज्ञान', en: 'General Science' },
    cat_mathematics:        { hi: 'गणित', en: 'Mathematics' },
    cat_reasoning:          { hi: 'तर्कशक्ति', en: 'Reasoning' },
    cat_english:            { hi: 'अंग्रेज़ी', en: 'English' },
    cat_hindi_grammar:      { hi: 'हिन्दी व्याकरण', en: 'Hindi Grammar' },
    cat_computer:           { hi: 'कंप्यूटर ज्ञान', en: 'Computer Knowledge' },
    cat_current_affairs:    { hi: 'समसामयिक घटनाएं', en: 'Current Affairs' },

    // ===== PRACTICE =====
    practice_title:         { hi: 'विषयवार अभ्यास', en: 'Topic Practice' },
    practice_all:           { hi: 'सभी विषय', en: 'All Topics' },
    practice_select_topic:  { hi: 'विषय चुनें', en: 'Select Topic' },
    practice_difficulty:    { hi: 'कठिनाई स्तर', en: 'Difficulty' },
    practice_easy:          { hi: 'आसान', en: 'Easy' },
    practice_medium:        { hi: 'मध्यम', en: 'Medium' },
    practice_hard:          { hi: 'कठिन', en: 'Hard' },
    practice_all_levels:    { hi: 'सभी स्तर', en: 'All Levels' },
    practice_start:         { hi: 'अभ्यास शुरू करें', en: 'Start Practice' },
    practice_questions_count:{ hi: 'प्रश्न', en: 'Questions' },

    // ===== QUIZ ENGINE =====
    quiz_question:          { hi: 'प्रश्न', en: 'Question' },
    quiz_of:                { hi: 'में से', en: 'of' },
    quiz_next:              { hi: 'अगला', en: 'Next' },
    quiz_prev:              { hi: 'पिछला', en: 'Prev' },
    quiz_submit:            { hi: 'सबमिट करें', en: 'Submit' },
    quiz_finish:            { hi: 'समाप्त करें', en: 'Finish' },
    quiz_hint:              { hi: 'संकेत', en: 'Hint' },
    quiz_explanation:       { hi: 'व्याख्या', en: 'Explanation' },
    quiz_correct:           { hi: 'सही!', en: 'Correct!' },
    quiz_wrong:             { hi: 'गलत!', en: 'Wrong!' },
    quiz_skipped:           { hi: 'छोड़ा', en: 'Skipped' },
    quiz_bookmark:          { hi: 'सेव करें', en: 'Save' },
    quiz_bookmarked:        { hi: 'सेव किया', en: 'Saved' },
    quiz_time_left:         { hi: 'समय शेष', en: 'Time Left' },
    quiz_confirm_submit:    { hi: 'क्या आप सच में सबमिट करना चाहते हैं?', en: 'Sure you want to submit?' },
    quiz_unanswered:        { hi: 'अनुत्तरित प्रश्न', en: 'unanswered questions' },
    quiz_confirm_yes:       { hi: 'हाँ, सबमिट करें', en: 'Yes, Submit' },
    quiz_confirm_no:        { hi: 'वापस जाएं', en: 'Go Back' },
    quiz_flag:              { hi: 'चिह्नित करें', en: 'Flag' },
    quiz_flagged:           { hi: 'चिह्नित', en: 'Flagged' },
    quiz_palette:           { hi: 'प्रश्न सूची', en: 'Question Palette' },
    quiz_answered:          { hi: 'उत्तर दिया', en: 'Answered' },
    quiz_not_answered:      { hi: 'उत्तर नहीं दिया', en: 'Not Answered' },
    quiz_marked_review:     { hi: 'समीक्षा के लिए', en: 'Marked for Review' },

    // ===== MOCK TEST =====
    mock_title:             { hi: 'मॉक टेस्ट', en: 'Mock Tests' },
    mock_ssc:               { hi: 'SSC टेस्ट', en: 'SSC Test' },
    mock_hssc:              { hi: 'HSSC टेस्ट', en: 'HSSC Test' },
    mock_banking:           { hi: 'Banking टेस्ट', en: 'Banking Test' },
    mock_questions:         { hi: 'प्रश्न', en: 'Questions' },
    mock_duration:          { hi: 'समय', en: 'Duration' },
    mock_marks:             { hi: 'अंक', en: 'Marks' },
    mock_negative:          { hi: 'ऋणात्मक अंक', en: 'Negative Marking' },
    mock_start:             { hi: 'टेस्ट शुरू करें', en: 'Start Test' },
    mock_minutes:           { hi: 'मिनट', en: 'Minutes' },
    mock_per_q:             { hi: 'प्रति प्रश्न', en: 'per question' },
    mock_demo_label:        { hi: '[डेमो टेस्ट]', en: '[Demo Test]' },
    mock_time_up:           { hi: 'समय समाप्त!', en: 'Time Up!' },
    mock_time_up_msg:       { hi: 'टेस्ट स्वतः सबमिट हो गया', en: 'Test auto-submitted' },

    // ===== RESULTS =====
    result_title:           { hi: 'परिणाम', en: 'Result' },
    result_score:           { hi: 'स्कोर', en: 'Score' },
    result_correct:         { hi: 'सही', en: 'Correct' },
    result_wrong:           { hi: 'गलत', en: 'Wrong' },
    result_skipped:         { hi: 'छोड़े', en: 'Skipped' },
    result_accuracy:        { hi: 'सटीकता', en: 'Accuracy' },
    result_time_taken:      { hi: 'लिया समय', en: 'Time Taken' },
    result_review:          { hi: 'समीक्षा करें', en: 'Review Answers' },
    result_retry:           { hi: 'फिर प्रयास करें', en: 'Try Again' },
    result_home:            { hi: 'होम पर जाएं', en: 'Go Home' },
    result_excellent:       { hi: 'शानदार!', en: 'Excellent!' },
    result_good:            { hi: 'अच्छा!', en: 'Good!' },
    result_average:         { hi: 'ठीक है', en: 'Average' },
    result_poor:            { hi: 'और मेहनत करें', en: 'Keep Practicing' },
    result_subjectwise:     { hi: 'विषयवार विश्लेषण', en: 'Subject-wise Analysis' },
    result_share:           { hi: 'शेयर करें', en: 'Share' },

    // ===== BOOKMARKS =====
    bkm_title:              { hi: 'सेव किए गए', en: 'Saved Questions' },
    bkm_saved:              { hi: 'सेव किए', en: 'Saved' },
    bkm_wrong:              { hi: 'गलत उत्तर', en: 'Wrong Answers' },
    bkm_empty_saved:        { hi: 'कोई सेव नहीं है\nक्विज़ में ❤️ दबाएं', en: 'Nothing saved yet\nTap ❤️ during quiz' },
    bkm_empty_wrong:        { hi: 'कोई गलत उत्तर नहीं!\nबहुत अच्छा 🎉', en: 'No wrong answers!\nGreat job 🎉' },
    bkm_clear:              { hi: 'सभी हटाएं', en: 'Clear All' },
    bkm_practice_saved:     { hi: 'सेव किए अभ्यास करें', en: 'Practice Saved' },
    bkm_practice_wrong:     { hi: 'गलत दोहराएं', en: 'Revise Wrong' },

    // ===== PROFILE =====
    profile_title:          { hi: 'प्रोफ़ाइल', en: 'Profile' },
    profile_edit:           { hi: 'संपादित करें', en: 'Edit' },
    profile_name:           { hi: 'नाम', en: 'Name' },
    profile_language:       { hi: 'भाषा', en: 'Language' },
    profile_streak:         { hi: 'स्ट्रीक', en: 'Streak' },
    profile_total_qs:       { hi: 'कुल प्रश्न', en: 'Total Questions' },
    profile_correct:        { hi: 'सही', en: 'Correct' },
    profile_accuracy:       { hi: 'औसत सटीकता', en: 'Avg Accuracy' },
    profile_reset:          { hi: 'डेटा रीसेट करें', en: 'Reset Data' },
    profile_reset_confirm:  { hi: 'क्या आप वाकई सभी डेटा हटाना चाहते हैं?', en: 'Delete all your progress data?' },
    profile_reset_yes:      { hi: 'हाँ, हटाएं', en: 'Yes, Delete' },
    profile_cancel:         { hi: 'रद्द करें', en: 'Cancel' },
    profile_saved:          { hi: 'प्रोफ़ाइल सेव हो गई', en: 'Profile saved' },
    profile_performance:    { hi: 'प्रदर्शन', en: 'Performance' },
    profile_settings:       { hi: 'सेटिंग्स', en: 'Settings' },

    // ===== LEADERBOARD =====
    lb_title:               { hi: 'लीडरबोर्ड', en: 'Leaderboard' },
    lb_rank:                { hi: 'रैंक', en: 'Rank' },
    lb_name:                { hi: 'नाम', en: 'Name' },
    lb_score:               { hi: 'स्कोर', en: 'Score' },
    lb_local:               { hi: 'स्थानीय', en: 'Local' },
    lb_your_rank:           { hi: 'आपकी रैंक', en: 'Your Rank' },
    lb_empty:               { hi: 'अभी कोई स्कोर नहीं', en: 'No scores yet' },

    // ===== STREAK =====
    streak_days:            { hi: 'दिनों की स्ट्रीक', en: 'Day Streak' },
    streak_best:            { hi: 'सर्वश्रेष्ठ', en: 'Best' },
    streak_today:           { hi: 'आज', en: 'Today' },
    streak_done:            { hi: 'पूरा', en: 'Done' },

    // ===== COMMON =====
    common_loading:         { hi: 'लोड हो रहा है...', en: 'Loading...' },
    common_error:           { hi: 'कुछ गलत हो गया', en: 'Something went wrong' },
    common_retry:           { hi: 'पुनः प्रयास करें', en: 'Retry' },
    common_ok:              { hi: 'ठीक है', en: 'OK' },
    common_cancel:          { hi: 'रद्द', en: 'Cancel' },
    common_yes:             { hi: 'हाँ', en: 'Yes' },
    common_no:              { hi: 'नहीं', en: 'No' },
    common_back:            { hi: 'वापस', en: 'Back' },
    common_save:            { hi: 'सेव करें', en: 'Save' },
    common_close:           { hi: 'बंद करें', en: 'Close' },
    common_demo_note:       { hi: '⚠️ ये डेमो प्रश्न हैं। ये पिछले वर्षों के आधिकारिक प्रश्न नहीं हैं।', en: '⚠️ These are demo questions. Not official previous-year papers.' },
    common_offline:         { hi: 'आप ऑफलाइन हैं', en: 'You are offline' },
    common_online:          { hi: 'वापस ऑनलाइन', en: 'Back online' },
    common_min:             { hi: 'मिनट', en: 'min' },
    common_sec:             { hi: 'सेकंड', en: 'sec' },
    common_marks:           { hi: 'अंक', en: 'marks' },

    // ===== ADMIN (English only - admin panel intentionally EN) =====
    admin_disabled_title:   { hi: 'Admin Panel अक्षम है', en: 'Admin Panel Disabled' },
    admin_disabled_msg:     { hi: 'सुरक्षित बैकएंड के बिना Admin panel सार्वजनिक बिल्ड में उपलब्ध नहीं है।', en: 'Admin panel is not available in the public build without a secure backend.' },

    // ===== PREMIUM =====
    premium_locked:         { hi: 'प्रीमियम कंटेंट', en: 'Premium Content' },
    premium_upgrade:        { hi: 'अपग्रेड करें', en: 'Upgrade' },
    premium_free_limit:     { hi: 'निःशुल्क सीमा समाप्त', en: 'Free limit reached' },

    // ===== EXAM TYPES =====
    exam_ssc:               { hi: 'SSC', en: 'SSC' },
    exam_hssc:              { hi: 'HSSC', en: 'HSSC' },
    exam_banking:           { hi: 'Banking', en: 'Banking' },

    // ===== DIFFICULTY =====
    diff_easy:              { hi: 'आसान', en: 'Easy' },
    diff_medium:            { hi: 'मध्यम', en: 'Medium' },
    diff_hard:              { hi: 'कठिन', en: 'Hard' },
  };

  let _lang = 'hi';

  function setLang(lang) {
    if (lang === 'hi' || lang === 'en') {
      _lang = lang;
      Storage.set('lang', lang);
    }
  }

  function getLang() { return _lang; }

  function t(key, params = {}) {
    const entry = strings[key];
    if (!entry) { console.warn('[I18n] Missing key:', key); return key; }
    let str = entry[_lang] || entry.en || key;
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v);
    });
    return str;
  }

  function tCat(categoryId) {
    const map = {
      'haryana-gk': 'cat_haryana_gk',
      'general-knowledge': 'cat_general_knowledge',
      'general-science': 'cat_general_science',
      'mathematics': 'cat_mathematics',
      'reasoning': 'cat_reasoning',
      'english': 'cat_english',
      'hindi-grammar': 'cat_hindi_grammar',
      'computer-knowledge': 'cat_computer',
      'current-affairs': 'cat_current_affairs',
    };
    return t(map[categoryId] || categoryId);
  }

  // Translate all [data-i18n] elements on the current page
  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      el.textContent = t(k);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    // Set lang attribute on root
    document.documentElement.lang = _lang;
    document.body.classList.toggle('app-lang-hi', _lang === 'hi');
    document.body.classList.toggle('app-lang-en', _lang === 'en');
  }

  function init() {
    const saved = Storage.get('lang', 'hi');
    setLang(saved);
  }

  return { init, t, tCat, setLang, getLang, translatePage };
})();

window.I18n = I18n;
