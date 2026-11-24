/**
 * ExamSaathi App Controller & Router
 * Boot sequence, hash-based routing, page rendering, chrome management.
 * Depends on: Storage, State, I18n, Auth (must load first)
 */
const App = (() => {

  const AUTH_REQUIRED = new Set([
    'home','practice','categories','daily-quiz',
    'mock-test-list','mock-test-config','quiz-session',
    'result','bookmarks','profile','leaderboard',
  ]);

  // Pages that should highlight a bottom-nav tab other than their own name
  const NAV_PARENT = {
    'practice': 'categories',
    'mock-test-config': 'mock-test-list',
  };

  const HIDE_BOTTOM_NAV = new Set([
    'splash','onboarding','quiz-session','result','admin-login',
  ]);

  const HIDE_HEADER = new Set([
    'splash','onboarding','quiz-session',
  ]);

  const NAV_TABS = [
    { hash: 'home',      icon: '🏠', labelKey: 'nav_home'      },
    { hash: 'categories',icon: '📚', labelKey: 'nav_practice'  },
    { hash: 'mock-test-list', icon: '📝', labelKey: 'nav_tests' },
    { hash: 'bookmarks', icon: '❤️',  labelKey: 'nav_bookmarks' },
    { hash: 'profile',   icon: '👤', labelKey: 'nav_profile'   },
  ];

  let _currentPage = null;
  let _prevPage    = null;
  let _toastTimer  = null;
  let _modalEl     = null;
  let _isBooting   = true;

  let $pageContainer = null;
  let $header        = null;
  let $headerTitle   = null;
  let $headerLeft    = null;
  let $headerRight   = null;
  let $bottomNav     = null;
  let $splashScreen  = null;

  /* ===== BOOT ===== */

  function _boot() {
    $pageContainer = document.getElementById('page-container');
    $header        = document.getElementById('app-header');
    $headerTitle   = document.getElementById('header-title');
    $headerLeft    = document.getElementById('header-left');
    $headerRight   = document.getElementById('header-right');
    $bottomNav     = document.getElementById('bottom-nav');
    $splashScreen  = document.getElementById('splash-screen');

    I18n.init();
    Auth.loadUserToState();
    _buildBottomNav();
    _listenOnlineStatus();
    _registerServiceWorker();
    _setupNativeBackButton();

    // Keep the splash up until both the minimum splash time has passed and
    // the question bank has loaded (capped at 6s), then show the first page.
    Promise.all([_showSplash(), _preloadQuestions()]).then(() => {
      if ($splashScreen) $splashScreen.classList.add('hidden');
      _isBooting = false;
      _handleInitialRoute();
    });

    window.addEventListener('hashchange', _onHashChange);
  }

  function _showSplash() {
    return new Promise(resolve => {
      if (!$splashScreen) { resolve(); return; }
      $splashScreen.classList.remove('hidden');
      const MIN_MS = 1800;
      const start  = Date.now();
      function done() {
        const wait = Math.max(0, MIN_MS - (Date.now() - start));
        setTimeout(resolve, wait);
      }
      requestAnimationFrame(done);
    });
  }

  function _preloadQuestions() {
    if (!window.QuestionBank) return Promise.resolve();
    const timeout = new Promise(resolve => setTimeout(resolve, 6000));
    const load = QuestionBank.preload()
      .then(r => console.log('[App] Questions loaded:', r))
      .catch(e => console.warn('[App] Question preload failed:', e));
    return Promise.race([load, timeout]);
  }

  function _handleInitialRoute() {
    const { page, query } = _parseHash(location.hash);
    if (Auth.isLoggedIn()) {
      // Keep the query string (e.g. #practice?cat=haryana survives a reload)
      navigate(page && _hasTemplate(page) ? page + query : 'home', { replace: true });
    } else {
      navigate('onboarding', { replace: true });
    }
  }

  /* ===== ROUTER ===== */

  // '#Practice?cat=haryana' -> { page: 'practice', query: '?cat=haryana' }
  function _parseHash(raw) {
    const s = (raw || '').replace(/^#/, '').trim();
    const i = s.indexOf('?');
    return {
      page:  (i >= 0 ? s.slice(0, i) : s).toLowerCase(),
      query: i >= 0 ? s.slice(i) : '',
    };
  }

  function _onHashChange() {
    if (_isBooting) return;
    _route(_parseHash(location.hash).page || 'home');
  }

  // Accepts 'page', '#page' or '#page?key=value'. The query string is kept
  // in the URL so page scripts can read it from location.hash.
  function navigate(hash, opts = {}) {
    const { page, query } = _parseHash(hash || 'home');
    const target = page || 'home';
    const newUrl = '#' + target + query;
    if (opts.replace) history.replaceState(null,'', newUrl);
    else history.pushState(null,'', newUrl);
    _route(target);
  }

  function _route(hash) {
    if (!hash) hash = 'home';

    if (AUTH_REQUIRED.has(hash) && !Auth.isLoggedIn()) {
      navigate('onboarding', { replace: true }); return;
    }
    if (hash === 'admin-login' || hash === 'admin') {
      _renderAdminDisabled(); _updateChrome('admin-login'); return;
    }
    if (!_hasTemplate(hash)) {
      console.warn('[App] No template for:', hash);
      navigate(Auth.isLoggedIn() ? 'home' : 'onboarding', { replace: true }); return;
    }

    _prevPage    = _currentPage;
    _currentPage = hash;
    State.update({ currentPage: hash, prevPage: _prevPage });

    _renderPage(hash);
    _updateChrome(hash);
    I18n.translatePage();
    if ($pageContainer) $pageContainer.scrollTop = 0;
  }

  /* ===== PAGE RENDERING ===== */

  function _hasTemplate(name) {
    return !!document.getElementById('tpl-' + name);
  }

  function _renderPage(hash) {
    const tpl = document.getElementById('tpl-' + hash);
    if (!tpl || !$pageContainer) return;
    const node = tpl.content.cloneNode(true);
    $pageContainer.innerHTML = '';
    $pageContainer.appendChild(node);
    _callPageInit(hash);
  }

  function _renderAdminDisabled() {
    if (!$pageContainer) return;
    $pageContainer.innerHTML = `
      <div class="admin-disabled-notice" style="margin:var(--space-6)">
        <div style="font-size:48px">🔒</div>
        <h2 style="font-size:var(--text-xl);font-weight:var(--font-bold);margin-top:var(--space-4)">${I18n.t('admin_disabled_title')}</h2>
        <p style="color:var(--color-text-secondary);font-size:var(--text-sm);margin-top:var(--space-2)">${I18n.t('admin_disabled_msg')}</p>
        <button class="btn btn-outline btn-sm" style="margin-top:var(--space-5)"
                onclick="App.navigate('home')">${I18n.t('common_back')}</button>
      </div>`;
  }

  function _callPageInit(hash) {
    try {
      if (window.Pages && window.Pages[hash] && typeof window.Pages[hash].init === 'function') {
        window.Pages[hash].init($pageContainer);
      }
    } catch (e) { console.error('[App] Page init error:', hash, e); }
  }

  /* ===== CHROME ===== */

  function _updateChrome(page) {
    _updateHeader(page);
    _updateBottomNav(page);
  }

  function _updateHeader(page) {
    if (!$header) return;
    if (HIDE_HEADER.has(page)) { $header.classList.add('hidden'); return; }
    $header.classList.remove('hidden');
    const TITLES = {
      home: 'app_name', categories: 'practice_title', practice: 'practice_title',
      result: 'result_title', bookmarks: 'bkm_title', profile: 'profile_title',
      leaderboard: 'lb_title', 'mock-test-list': 'mock_title', 'mock-test-config': 'mock_title',
      'admin-login': 'admin_disabled_title',
    };
    const key   = TITLES[page];
    const title = key ? I18n.t(key) : '';
    setHeader(title, page !== 'home' && page !== 'categories');
  }

  function setHeader(title, showBack = false, onBack = null, rightHtml = '') {
    if ($headerTitle) $headerTitle.textContent = title;
    if ($headerLeft) {
      if (showBack) {
        $headerLeft.innerHTML = `<button class="header-back-btn" id="hdr-back" aria-label="${I18n.t('common_back')}">&#8592;</button>`;
        const btn = document.getElementById('hdr-back');
        if (btn) btn.addEventListener('click', () => {
          if (typeof onBack === 'function') onBack();
          else if (_prevPage) navigate(_prevPage);
          else history.back();
        }, { once: true });
      } else { $headerLeft.innerHTML = ''; }
    }
    if ($headerRight) $headerRight.innerHTML = rightHtml || '';
  }

  function _buildBottomNav() {
    if (!$bottomNav) return;
    $bottomNav.innerHTML = NAV_TABS.map(t => `
      <div class="nav-item" data-nav="${t.hash}" role="button" tabindex="0" aria-label="${I18n.t(t.labelKey)}">
        <span class="nav-icon">${t.icon}</span>
        <span class="nav-label">${I18n.t(t.labelKey)}</span>
      </div>`).join('');
    $bottomNav.addEventListener('click', e => {
      const item = e.target.closest('[data-nav]');
      if (item) navigate(item.dataset.nav);
    });
  }

  function _updateBottomNav(page) {
    if (!$bottomNav) return;
    if (HIDE_BOTTOM_NAV.has(page)) { $bottomNav.classList.add('hidden'); return; }
    $bottomNav.classList.remove('hidden');
    $bottomNav.querySelectorAll('.nav-item').forEach(el => {
      const active = el.dataset.nav === page || el.dataset.nav === NAV_PARENT[page];
      el.classList.toggle('active', active);
      el.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  /* ===== TOAST ===== */

  function showToast(msg, type = 'default', duration = 3000) {
    const ex = document.getElementById('app-toast');
    if (ex) ex.remove();
    if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null; }
    const el = document.createElement('div');
    el.id = 'app-toast';
    el.className = 'toast' + (type !== 'default' ? ' toast-' + type : '');
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    _toastTimer = setTimeout(() => {
      el.classList.add('toast-out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
      setTimeout(() => { if (el.parentNode) el.remove(); }, 500);
    }, duration);
  }

  /* ===== MODAL ===== */

  function showModal({ title = '', body = '', actions = [], dismissable = true } = {}) {
    closeModal();
    const actionsHtml = actions.map((a, i) => {
      const cls = 'btn btn-block mt-3' + (a.primary ? ' btn-primary' : a.danger ? ' btn-danger' : ' btn-outline');
      return `<button class="${cls}" data-modal-action="${i}">${a.label}</button>`;
    }).join('');
    _modalEl = document.createElement('div');
    _modalEl.className = 'modal-overlay';
    _modalEl.id = 'app-modal-overlay';
    _modalEl.setAttribute('role', 'dialog');
    _modalEl.setAttribute('aria-modal', 'true');
    _modalEl.innerHTML = `
      <div class="modal" role="document">
        <div class="modal-handle"></div>
        ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
        <div>${body}</div>
        ${actionsHtml ? `<div>${actionsHtml}</div>` : ''}
      </div>`;
    document.body.appendChild(_modalEl);
    _modalEl.querySelectorAll('[data-modal-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = actions[parseInt(btn.dataset.modalAction, 10)];
        if (a && typeof a.onClick === 'function') a.onClick();
      });
    });
    if (dismissable) {
      _modalEl.addEventListener('click', e => { if (e.target === _modalEl) closeModal(); });
    }
    requestAnimationFrame(() => { const b = _modalEl.querySelector('button'); if (b) b.focus(); });
  }

  function closeModal() {
    if (_modalEl) { _modalEl.remove(); _modalEl = null; }
    const s = document.getElementById('app-modal-overlay');
    if (s) s.remove();
  }

  /* ===== ONLINE/OFFLINE ===== */

  function _listenOnlineStatus() {
    window.addEventListener('offline', () => showToast(I18n.t('common_offline'), 'warning', 4000));
    window.addEventListener('online',  () => showToast(I18n.t('common_online'),  'success', 2500));
  }

  /* ===== SERVICE WORKER ===== */

  /* ===== ANDROID BACK BUTTON (native app only) ===== */

  function _setupNativeBackButton() {
    if (!_isNativeApp()) return;
    const CapApp = window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (!CapApp) return;
    // Registering a listener replaces the default (plain history back).
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (_modalEl || document.getElementById('app-modal-overlay')) { closeModal(); return; }
      if (_currentPage === 'quiz-session') {
        showModal({
          title: 'टेस्ट छोड़ें? / Leave test?',
          body: '<p class="text-secondary">आपके जवाब सेव नहीं होंगे। / Your answers will not be saved.</p>',
          actions: [
            { label: 'जारी रखें / Continue', primary: true, onClick: () => closeModal() },
            { label: 'छोड़ें / Leave', danger: true, onClick: () => { closeModal(); navigate('home'); } },
          ],
        });
        return;
      }
      if (_currentPage === 'result') { navigate('home', { replace: true }); return; }
      if (_currentPage === 'home' || _currentPage === 'onboarding' || !canGoBack) {
        CapApp.exitApp();
        return;
      }
      history.back();
    });
  }

  function _isNativeApp() {
    return !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' &&
              window.Capacitor.isNativePlatform());
  }

  function _registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    // In the Android app all files are bundled locally; a cache-first
    // service worker would keep serving old JS/CSS after an app update.
    if (_isNativeApp()) {
      navigator.serviceWorker.getRegistrations()
        .then(regs => regs.forEach(r => r.unregister()))
        .catch(() => {});
      return;
    }
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(r => console.log('[App] SW registered:', r.scope))
      .catch(e => console.warn('[App] SW failed:', e));
  }

  /* ===== PAGE REGISTRY ===== */

  if (!window.Pages) window.Pages = {};

  function registerPage(hash, handler) {
    if (!window.Pages) window.Pages = {};
    window.Pages[hash] = handler;
  }

  function setLoading(visible) {
    const ex = document.getElementById('page-loading');
    if (visible && !ex && $pageContainer) {
      const el = document.createElement('div');
      el.id = 'page-loading';
      el.className = 'flex-center';
      el.style.cssText = 'position:absolute;inset:0;background:var(--color-bg);z-index:50;';
      el.innerHTML = '<div class="spinner spinner-lg"></div>';
      $pageContainer.appendChild(el);
    } else if (!visible && ex) { ex.remove(); }
  }

  /* ===== INIT ===== */

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _boot);
  else _boot();

  return {
    navigate, showToast, showModal, closeModal, setHeader, setLoading, registerPage,
    get currentPage() { return _currentPage; },
    get prevPage()    { return _prevPage; },
  };

})();

window.App = App;
