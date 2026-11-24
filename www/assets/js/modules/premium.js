/**
 * ExamSaathi Premium Module
 * Free/premium content gating. AdMob slot architecture (inactive in MVP).
 * No payment implementation in MVP per project requirements.
 */
const Premium = (() => {
  const FREE_LIMIT = 20; // questions per category for free users

  function isPremium() {
    // Always false in MVP. Wire to backend subscription check later.
    return false;
  }

  function canAccess(question) {
    if (!question) return true;
    if (isPremium()) return true;
    return question.tier !== 'premium';
  }

  function filterForUser(questions) {
    if (isPremium()) return questions;
    const free = questions.filter(q => q.tier !== 'premium');
    return free.slice(0, FREE_LIMIT);
  }

  function showUpgradePrompt() {
    App.showModal({
      title: I18n.t('premium_locked'),
      body: `<div class="text-center p-5">
        <div style="font-size:48px">🔒</div>
        <p class="mt-4 text-secondary">${I18n.t('premium_free_limit')}</p>
        <p class="mt-2 text-sm text-tertiary">${I18n.t('premium_upgrade')} - Coming Soon</p>
      </div>`,
      actions: [{ label: I18n.t('common_ok'), primary: true, onClick: () => App.closeModal() }],
    });
  }

  // AdMob slot placeholders — script NOT loaded in MVP
  // These become active after Google Play approval and AdMob app-id setup
  const slots = {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  };

  function showBannerAd(containerId) {
    // Inactive in MVP. No ads shown.
    return;
  }

  function showInterstitial(onClose) {
    // Inactive in MVP. Call onClose immediately.
    if (onClose) onClose();
  }

  return { isPremium, canAccess, filterForUser, showUpgradePrompt, showBannerAd, showInterstitial, slots };
})();

window.Premium = Premium;
