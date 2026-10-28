(function () {
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav: transparent over the hero, solid once you scroll
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40 || nav.classList.contains('open')); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  menuBtn.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    onScroll();
  });
  document.querySelectorAll('#menu a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
  });

  // reveal: only things below the first screen start hidden, so the page is complete at rest
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }

  // lightbox for regions and tales
  var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap'), lbClose = document.getElementById('lbClose');
  var lastFocus = null;
  function openLb(src, cap, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || cap || ''; lbCap.textContent = cap || '';
    lb.hidden = false; document.body.style.overflow = 'hidden'; lbClose.focus();
  }
  function closeLb() { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  document.querySelectorAll('[data-full]').forEach(function (el) {
    el.addEventListener('click', function () {
      var img = el.querySelector('img');
      openLb(el.getAttribute('data-full'), el.getAttribute('data-cap'), img && img.alt);
    });
  });
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  // the flower card responds to taps on phones too
  document.querySelectorAll('.who[tabindex]').forEach(function (card) {
    card.addEventListener('click', function () { card.classList.toggle('poked'); var alt = card.querySelector('.alt'); if (alt) alt.style.opacity = card.classList.contains('poked') ? 1 : ''; });
  });

  // embers rising over the hero
  var c = document.getElementById('embers');
  if (!c || reduce) return;
  var ctx = c.getContext('2d'), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), parts = [];
  function size() { var r = c.getBoundingClientRect(); W = r.width; H = r.height; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function spawn(init) {
    return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: 0.6 + Math.random() * 1.8, vy: 0.25 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.25, life: 0, max: 300 + Math.random() * 500, hue: 28 + Math.random() * 22, ph: Math.random() * 6.28 };
  }
  size(); window.addEventListener('resize', size);
  var N = Math.round(Math.min(70, W / 18));
  for (var i = 0; i < N; i++) parts.push(spawn(true));
  var visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(c);
  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.life++; p.y -= p.vy; p.x += p.vx + Math.sin((p.life / 40) + p.ph) * 0.25;
      var a = Math.min(1, p.life / 60) * Math.max(0, 1 - p.life / p.max);
      if (p.y < -10 || p.life > p.max) { parts[i] = spawn(false); continue; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = 'hsla(' + p.hue + ',100%,62%,' + (a * 0.85).toFixed(3) + ')';
      ctx.shadowColor = 'hsla(' + p.hue + ',100%,55%,.9)'; ctx.shadowBlur = 8;
      ctx.fill();
    }
  })();
})();
