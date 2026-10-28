/* Play-button tracking. Sends a "play_click" event (which button, which page) to GA4 or Plausible
   when either is installed. To turn on GA4, set GA_ID below to your Measurement ID (G-XXXXXXX). */
(function () {
  var GA_ID = '';
  if (GA_ID) {
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="roblox.com/games/"]');
    if (!a) return;
    var label = a.getAttribute('data-cta') || (a.textContent || '').trim().slice(0, 40);
    var props = { cta: label, page: location.pathname };
    try { if (window.gtag) gtag('event', 'play_click', props); } catch (_) {}
    try { if (window.plausible) plausible('Play Click', { props: props }); } catch (_) {}
  }, true);
})();
