/**
 * ExamSaathi Admin Auth
 *
 * SECURITY NOTICE:
 * The admin panel is DISABLED in the public build. There are no hardcoded
 * credentials in this file. LocalStorage-based auth is not production-grade.
 * Admin functionality must only be enabled after a secure backend
 * (server-side auth with proper session management) is implemented.
 *
 * This file exists as an architecture placeholder only.
 */
const AdminAuth = (() => {
  const ADMIN_ENABLED = false; // Set to true only when secure backend is ready

  function isEnabled() { return ADMIN_ENABLED; }

  function isLoggedIn() {
    if (!ADMIN_ENABLED) return false;
    return false; // Always false in public build
  }

  function logout() {
    // No-op in public build
  }

  return { isEnabled, isLoggedIn, logout };
})();

window.AdminAuth = AdminAuth;
