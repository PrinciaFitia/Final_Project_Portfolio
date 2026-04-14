/* ═══════════════════════════════════════════════════
   script.js — Nadine Bellombre
   Jazz · Élégance · Île Maurice
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNoise();
  initCursor();
  initNav();
  initScrollAnim();
  initBio();
  initGallery();
  initForm();
  initLang();
  initConcertFlags();
});

/* ─── CANVAS BRUIT ──────────────────────────────── */
function initNoise() {
  const canvas = document.getElementById('stage-noise');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let frame;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawNoise() {
    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 20; // très subtil
    }
    ctx.putImageData(img, 0, 0);
    frame = requestAnimationFrame(drawNoise);
  }

  resize();
  window.addEventListener('resize', resize);
  drawNoise();
}

/* ─── CURSOR ────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!dot || !ring) return;

  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 55);
  });

  document.querySelectorAll('a, button, .gm-item, .video-thumb, .stat-pill, .tl-card, .info-block, .gf-btn, .genre')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hov'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
    });
}

/* ─── NAV ───────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('navbar');
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('shrunk', window.scrollY > 60);
  }, { passive: true });

  document.addEventListener('click', e => {
    if (menu.classList.contains('open') &&
        !menu.contains(e.target) && !btn.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });

  if (btn) {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = btn.classList.toggle('open');
      menu.classList.toggle('open', isOpen);
    });
  }

  if (menu) {
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }
}

/* ─── SCROLL ANIMATIONS ─────────────────────────── */
function initScrollAnim() {
  const items = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('vis'), i * 110);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => obs.observe(el));
}

/* ─── BIO TOGGLE ────────────────────────────────── */
function initBio() {
  const btn  = document.getElementById('bioBtn');
  const body = document.getElementById('bioBody');
  if (!btn || !body) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    body.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    const lang = document.documentElement.lang || 'fr';
    const key = open
      ? (lang === 'en' ? 'enLess' : 'frLess')
      : (lang === 'en' ? 'enMore' : 'frMore');
    btn.querySelector('span').textContent = btn.dataset[key];
  });
}

/* ─── GALLERY FILTERS ───────────────────────────── */
function initGallery() {
  const btns  = document.querySelectorAll('.gf-btn');
  const items = document.querySelectorAll('.gm-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      items.forEach(item => {
        item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
      });
    });
  });
}

/* ─── FORM ──────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    let valid = true;

    const name  = document.getElementById('fname');
    const email = document.getElementById('femail');
    const msg   = document.getElementById('fmsg');

    if (!name.value.trim())  { showErr('fnameErr', name);  valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showErr('femailErr', email); valid = false; }
    if (!msg.value.trim())   { showErr('fmsgErr', msg);    valid = false; }

    if (valid) sendForm(form);
  });
}
function showErr(id, field) {
  document.getElementById(id)?.classList.add('show');
  field.classList.add('err');
}
function clearErrors() {
  document.querySelectorAll('.ferr').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.form-field input, .form-field textarea').forEach(f => f.classList.remove('err'));
}
function sendForm(form) {
  const btn  = document.getElementById('submitBtn');
  const ok   = document.getElementById('formOk');
  const lang = document.documentElement.lang || 'fr';

  btn.disabled = true;
  btn.querySelector('.submit-label').textContent = '…';

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString()
  })
    .then(res => {
      if (res.ok) {
        btn.style.display = 'none';
        ok.classList.add('show');
        setTimeout(() => {
          form.reset();
          btn.style.display = 'flex';
          btn.disabled = false;
          btn.querySelector('.submit-label').textContent = lang === 'en' ? 'Send' : 'Envoyer';
          ok.classList.remove('show');
        }, 4000);
      } else { handleSendError(btn, lang); }
    })
    .catch(() => handleSendError(btn, lang));
}
function handleSendError(btn, lang) {
  btn.disabled = false;
  btn.querySelector('.submit-label').textContent = lang === 'en' ? 'Send' : 'Envoyer';
  let err = document.getElementById('formSendErr');
  if (!err) {
    err = document.createElement('p');
    err.id = 'formSendErr';
    err.style.cssText = 'color:rgba(255,140,140,0.8);font-size:.85rem;margin-top:.5rem;';
    btn.parentNode.insertBefore(err, btn.nextSibling);
  }
  err.textContent = lang === 'en'
    ? 'An error occurred. Please try again or email nadbello@gmail.com'
    : 'Une erreur est survenue. Réessayez ou écrivez à nadbello@gmail.com';
  err.style.display = 'block';
  setTimeout(() => { err.style.display = 'none'; }, 6000);
}

/* ─── LANGUAGE FR / EN ──────────────────────────── */
function initLang() {
  const btn = document.getElementById('langBtn');
  if (!btn) return;
  let lang = 'fr';

  btn.addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    btn.textContent = lang === 'en' ? 'FR' : 'EN';
    document.documentElement.lang = lang;
    translateAll(lang);
    if (getConcertLang() !== 'dk') setConcertLang(lang);
  });
}

function translateAll(lang) {
  document.querySelectorAll('[data-fr]').forEach(el => {
    if (el.closest('.concert-desc-block')) return;
    const txt = el.dataset[lang] || el.dataset.fr;
    if (!txt) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = txt;
    else if (el.tagName === 'OPTION') el.textContent = txt;
    else el.textContent = txt;
  });

  const concertLang = getConcertLang();
  if (concertLang !== 'dk') translateConcertMeta(lang);

  // Bio button
  const bioBtn  = document.getElementById('bioBtn');
  const bioBody = document.getElementById('bioBody');
  if (bioBtn && bioBody) {
    const open = bioBody.classList.contains('open');
    const key = open ? (lang==='en'?'enLess':'frLess') : (lang==='en'?'enMore':'frMore');
    bioBtn.querySelector('span').textContent = bioBtn.dataset[key];
  }

  // Submit button
  const lbl = document.querySelector('.submit-label');
  if (lbl) lbl.textContent = lang === 'en' ? 'Send' : 'Envoyer';
}

/* ─── CONCERT FLAGS ─────────────────────────────── */
let _concertLang = null;
function getConcertLang() { return _concertLang; }

function setConcertLang(lang) {
  document.querySelectorAll('.concert-text').forEach(el => el.style.display = 'none');
  const target = document.querySelector('.concert-text-' + lang);
  if (target) target.style.display = '';
  translateConcertMeta(lang);
}

function translateConcertMeta(lang) {
  const section = document.getElementById('concert');
  if (!section) return;
  section.querySelectorAll('[data-fr]').forEach(el => {
    if (el.closest('.concert-desc-block')) return;
    const txt = el.dataset[lang] || el.dataset.en || el.dataset.fr;
    if (!txt) return;
    const strong = el.querySelector('strong');
    if (strong) {
      const name   = strong.textContent;
      const parts  = txt.split(name);
      if (parts.length === 2) {
        el.innerHTML = parts[0] + '<strong>' + name + '</strong>' + parts[1];
      } else el.textContent = txt;
    } else el.textContent = txt;
  });
}

function initConcertFlags() {
  const flagDK = document.getElementById('concertFlagDK');
  if (!flagDK) return;

  const siteLang = document.documentElement.lang || 'fr';
  _concertLang = null;
  setConcertLang(siteLang);
  flagDK.setAttribute('aria-pressed', 'false');

  flagDK.addEventListener('click', () => {
    if (_concertLang === 'dk') {
      _concertLang = null;
      const sl = document.documentElement.lang || 'fr';
      setConcertLang(sl);
      flagDK.classList.remove('active');
      flagDK.setAttribute('aria-pressed', 'false');
    } else {
      _concertLang = 'dk';
      setConcertLang('dk');
      flagDK.classList.add('active');
      flagDK.setAttribute('aria-pressed', 'true');
    }
  });
}
