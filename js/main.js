import C from './content.js';
import { cyrb53 } from './hash.js';

gsap.registerPlugin(ScrollTrigger);
if (window.SplitText) gsap.registerPlugin(SplitText);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const body = document.body;
const params = new URLSearchParams(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(hover: none), (max-width: 760px)').matches;
const UNLOCK_KEY = 'anika-unlocked';
const READ_KEY = 'anika-read';

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
if (params.has('reset')) { store.del(UNLOCK_KEY); store.del(READ_KEY); }

const setStage = (s) => { body.dataset.stage = s; };
const photoSrc = (name, small) => `assets/photos/${name}${small ? '-sm' : ''}.webp`;
const rnd = (a, b) => a + Math.random() * (b - a);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ───────────────── fill static text ─────────────────
for (const el of $$('[data-text]')) {
  const v = el.dataset.text.split('.').reduce((o, k) => o?.[k], C);
  if (typeof v === 'string') el.textContent = v;
}
$('.hero__name').textContent = C.name;
$('#letterBody').innerHTML = C.letter.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');

// ───────────────── story track ─────────────────
const allPhotos = [];
const track = $('#storyTrack');
{
  const tapes = ['rgba(214,170,160,.75)', 'rgba(190,200,170,.75)', 'rgba(230,205,150,.75)', 'rgba(180,195,215,.75)'];
  let html = '';
  C.chapters.forEach((ch, ci) => {
    html += `<div class="chapter-card" style="--dy:${rnd(0, 30)}px">
      <span class="chapter-card__no">${String(ci + 1).padStart(2, '0')} / ${String(C.chapters.length).padStart(2, '0')}</span>
      <h3>${esc(ch.title)}</h3><p>${esc(ch.note)}</p></div>`;
    ch.photos.forEach((ph) => {
      const i = allPhotos.push({ ...ph, chapter: ch.title }) - 1;
      const tilt = rnd(-4, 4).toFixed(1);
      html += `<button class="polaroid${ph.wide ? ' polaroid--wide' : ''}" data-photo="${i}"
        style="--tilt:${tilt}deg;--dy:${rnd(0, 46).toFixed(0)}px;--tape:${tapes[i % tapes.length]};--tape-r:${rnd(-5, 5).toFixed(1)}deg"
        aria-label="Open photo: ${esc(ph.caption)}">
        <span class="polaroid__img"><img src="${photoSrc(ph.src, true)}"
          srcset="${photoSrc(ph.src, true)} 480w, ${photoSrc(ph.src)} 1600w"
          sizes="(min-width: 900px) 30vw, 86vw" alt="${esc(ph.caption)}" loading="lazy" decoding="async"></span>
        <figcaption><span class="polaroid__tag">${esc(ph.tag)}</span><span class="polaroid__cap">${esc(ph.caption)}</span></figcaption>
      </button>`;
    });
  });
  html += `<p class="story-end">${esc(C.storyEnd)}</p>`;
  track.innerHTML = '<svg class="story__line" id="storyLine" aria-hidden="true"><path/></svg>' + html;
}

// ───────────────── open-when envelopes ─────────────────
const readSet = new Set(JSON.parse(store.get(READ_KEY) || '[]'));
$('#envelopes').innerHTML = C.openWhen.letters.map((l, i) => `
  <button class="envelope${readSet.has(i) ? ' is-read' : ''}" data-letter="${i}" data-tint="${l.tint}" style="--tilt:${rnd(-3, 3).toFixed(1)}deg">
    <span class="envelope__back"></span>
    <span class="envelope__note"></span>
    <span class="envelope__front"></span>
    <span class="envelope__flap"></span>
    <span class="envelope__seal">${C.from[0]}</span>
    <span class="envelope__stamp">OPENED</span>
    <span class="envelope__label"><small>open when</small>${esc(l.label)}</span>
  </button>`).join('');

// ───────────────── closing ─────────────────
$('#closingText').innerHTML =
  C.closing.lines.map((l, i) => `<p class="${i === 2 ? 'closing__big' : ''}">${esc(l)}</p>`).join('') +
  `<p class="signature">${esc(C.closing.signature)}</p>`;
$('#againBtn').textContent = `${C.closing.again} ↺`;

// ───────────────── scene ─────────────────
let scene = null;
async function boot() {
  const fonts = Promise.all([
    document.fonts.load('64px "Homemade Apple"'),
    document.fonts.load('italic 200px "Playfair Display"'),
    document.fonts.load('26px "Special Elite"'),
    document.fonts.load('24px "Caveat"'),
  ]).catch(() => {});
  await Promise.race([fonts, new Promise((r) => setTimeout(r, 4000))]);

  try {
    const { createScene } = await import('./scene.js');
    scene = createScene($('#scene'), {
      name: C.name, mobile, reduced,
      photos: ['yamcha-2', 'boishakh', 'neon'].map((p) => photoSrc(p, true)),
    });
    await Promise.race([scene.ready, new Promise((r) => setTimeout(r, 5000))]);
    scene.start();
  } catch (err) {
    console.warn('WebGL unavailable, falling back', err);
    document.documentElement.classList.add('no-webgl');
    body.classList.add('no-webgl');
  }

  const unlockAt = Date.parse(C.unlockAt);
  const early = Date.now() < unlockAt && params.get('preview') !== 'open';
  if (params.has('skip')) { setStage('open'); scene?.toAmbient(); setupPage(true); return; }
  if (early) startCountdown(unlockAt);
  else if (store.get(UNLOCK_KEY) === '1') setStage('ready');
  else lockStage();
}

// ───────────────── countdown ─────────────────
function startCountdown(target) {
  setStage('sealed');
  const els = Object.fromEntries($$('[data-cd]').map((e) => [e.dataset.cd, e]));
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const ms = target - Date.now();
    if (ms <= 0) {
      clearInterval(id);
      lockStage();
      return;
    }
    const s = Math.floor(ms / 1000);
    els.d.textContent = pad(Math.floor(s / 86400));
    els.h.textContent = pad(Math.floor(s / 3600) % 24);
    els.m.textContent = pad(Math.floor(s / 60) % 60);
    els.s.textContent = pad(s % 60);
  };
  const id = setInterval(tick, 1000);
  tick();
}

// ───────────────── lock ─────────────────
function lockStage() {
  setStage('locked');
  scene?.setSealGlow(0.45);
}

let tries = 0;
$('#lockForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#answer');
  const guess = input.value.trim().toLowerCase();
  if (!guess) return input.focus();
  if (cyrb53(guess) === C.lock.hash) {
    store.set(UNLOCK_KEY, '1');
    input.blur();
    openLetter();
    return;
  }
  tries++;
  const form = $('#lockForm');
  form.classList.remove('shake');
  void form.offsetWidth;
  form.classList.add('shake');
  $('#hint').textContent = tries === 1 ? 'Hmm… not quite, my love. Try again?' : `Hint: ${C.lock.hint}`;
  input.select();
});
$('#openBtn').addEventListener('click', () => openLetter());

// ───────────────── the opening ─────────────────
async function openLetter() {
  setStage('opening');
  const flash = $('#paperFlash');
  if (scene) {
    await scene.open({ flash, onCovered: () => scene.toAmbient() });
  } else {
    await gsap.to(flash, { opacity: 1, duration: 0.8 });
  }
  setStage('open');
  window.scrollTo(0, 0);
  setupPage();
  gsap.to(flash, { opacity: 0, duration: 1.4, ease: 'power2.out', delay: 0.15 });
}

// ───────────────── the page after opening ─────────────────
let lenis = null;
let pageReady = false;
function setupPage(instant = false) {
  if (pageReady) return;
  pageReady = true;

  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // images: start loading everything now that the letter is open
  setTimeout(() => $$('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; }), 1500);

  // title writes itself
  setTimeout(() => $('#inkTitle').classList.add('is-written'), instant ? 0 : 900);

  // letter: line-by-line reveal
  const paras = $$('.letter__greeting, .letter__body p, .letter__sign');
  if (window.SplitText && !reduced) {
    paras.forEach((p) => SplitText.create(p, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: p, start: 'top 90%', once: true },
      }),
    }));
  } else {
    paras.forEach((p) => gsap.from(p, { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: p, start: 'top 90%', once: true } }));
  }
  gsap.from('.side-polaroid', { y: 120, rotate: 18, opacity: 0, duration: 1.6, ease: 'power3.out', delay: 1.2 });

  // section headings
  $$('.eyebrow, .display, .lede').forEach((el) => gsap.from(el, {
    y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true },
  }));

  setupStory();
  setupEnvelopes();
  setupClosing();
  setupCursor();
  ScrollTrigger.refresh();
}

// story: pinned horizontal clothesline on desktop, stacked on mobile
function setupStory() {
  const viewport = $('.story__viewport');
  const items = $$('.story__track > :not(svg)');
  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px)', () => {
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: viewport, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true,
        onRefresh: drawLine,
      },
    });
    items.forEach((el) => gsap.from(el, {
      y: -120, rotate: rnd(-14, 14), opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)', clearProps: 'transform',
      scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left 92%', once: true },
    }));
    drawLine();
    // hanging photos swing with scroll speed
    let sway = 0;
    const swing = () => {
      const v = lenis ? lenis.velocity : 0;
      sway += (gsap.utils.clamp(-7, 7, -v * 0.35) - sway) * 0.08;
      track.style.setProperty('--sway', `${sway.toFixed(2)}deg`);
    };
    gsap.ticker.add(swing);
    return () => { gsap.ticker.remove(swing); track.style.removeProperty('--sway'); };
  });

  mm.add('(max-width: 899px)', () => {
    items.forEach((el) => gsap.from(el, {
      y: 70, opacity: 0, rotate: rnd(-8, 8), duration: 1.1, ease: 'power3.out', clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    }));
  });
}

// a sagging string through every clothespin
function drawLine() {
  const svg = $('#storyLine');
  if (!svg || getComputedStyle(svg).display === 'none') return;
  const w = track.scrollWidth, h = track.offsetHeight;
  svg.setAttribute('width', w); svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.style.width = `${w}px`;
  const pins = $$('.polaroid, .chapter-card', track).map((el) => [el.offsetLeft + el.offsetWidth / 2, el.offsetTop - (el.classList.contains('polaroid') ? 22 : 30)]);
  if (!pins.length) return;
  const pts = [[0, pins[0][1] - 20], ...pins, [w, pins.at(-1)[1] - 20]];
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    d += ` Q${(x0 + x1) / 2},${Math.max(y0, y1) + Math.min(60, (x1 - x0) * 0.12)} ${x1},${y1}`;
  }
  $('path', svg).setAttribute('d', d);
}

// ───────────────── lightbox ─────────────────
const lb = $('#lightbox');
let lbIndex = 0;
function showPhoto(i) {
  lbIndex = (i + allPhotos.length) % allPhotos.length;
  const ph = allPhotos[lbIndex];
  const img = $('img', lb);
  img.src = photoSrc(ph.src);
  img.alt = ph.caption;
  $('.lightbox__tag', lb).textContent = `${ph.chapter} · ${ph.tag}`;
  $('.lightbox__cap', lb).textContent = ph.caption;
  gsap.fromTo('.lightbox__frame', { opacity: 0, y: 20, rotate: rnd(-3, 3) }, { opacity: 1, y: 0, rotate: 0, duration: 0.5, ease: 'power3.out' });
}
function openLightbox(i) { lb.hidden = false; lenis?.stop(); showPhoto(i); $('[data-close]', lb).focus(); }
function closeLightbox() { lb.hidden = true; lenis?.start(); }
track.addEventListener('click', (e) => {
  const p = e.target.closest('[data-photo]');
  if (p) openLightbox(+p.dataset.photo);
});
lb.addEventListener('click', (e) => {
  if (e.target.closest('[data-prev]')) showPhoto(lbIndex - 1);
  else if (e.target.closest('[data-next]')) showPhoto(lbIndex + 1);
  else if (e.target.closest('[data-close]') || e.target === lb) closeLightbox();
});
let touchX = null;
lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

// ───────────────── letter modal ─────────────────
const modal = $('#letterModal');
let openEnvelope = null;
function setupEnvelopes() {
  gsap.from('.envelope', {
    y: 80, opacity: 0, rotate: () => rnd(-12, 12), duration: 1, stagger: 0.08, ease: 'power3.out', clearProps: 'transform',
    scrollTrigger: { trigger: '#envelopes', start: 'top 85%', once: true },
  });
}
$('#envelopes').addEventListener('click', (e) => {
  const env = e.target.closest('[data-letter]');
  if (!env) return;
  const i = +env.dataset.letter;
  const l = C.openWhen.letters[i];
  openEnvelope = env;
  $('.modal__title', modal).textContent = `…${l.label}`;
  $('.modal__body', modal).innerHTML = l.body.map((p) => `<p>${esc(p)}</p>`).join('');
  $('.modal__sign', modal).textContent = C.from;
  modal.hidden = false;
  lenis?.stop();
  const paper = $('.modal__letter', modal);
  paper.scrollTop = 0;
  gsap.fromTo('.modal__backdrop', { opacity: 0 }, { opacity: 1, duration: 0.4 });
  gsap.fromTo(paper, { y: 120, rotateX: -18, scale: 0.9, opacity: 0, transformPerspective: 1200 },
    { y: 0, rotateX: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' });
  gsap.from($$('.modal__body p, .modal__sign', modal), { opacity: 0, y: 12, stagger: 0.12, delay: 0.35, duration: 0.7 });
  readSet.add(i);
  store.set(READ_KEY, JSON.stringify([...readSet]));
  $('.modal__close', modal).focus({ preventScroll: true });
});
function closeModal() {
  if (modal.hidden) return;
  gsap.to('.modal__letter', {
    y: 60, opacity: 0, scale: 0.95, duration: 0.35, ease: 'power2.in',
    onComplete: () => {
      modal.hidden = true;
      lenis?.start();
      openEnvelope?.classList.add('is-read');
      openEnvelope?.focus({ preventScroll: true });
    },
  });
}
modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });

document.addEventListener('keydown', (e) => {
  if (!lb.hidden) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
  } else if (!modal.hidden && e.key === 'Escape') closeModal();
});

// ───────────────── closing: words + the petal heart ─────────────────
function setupClosing() {
  const lines = $$('#closingText > *');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#closing', start: 'top top', end: 'bottom bottom', scrub: 1 },
  });
  lines.forEach((l, i) => tl.from(l, { opacity: 0, y: 30, filter: 'blur(8px)', duration: 1 }, i * 0.8));
  tl.from(['#againBtn', '#closing .footer'], { opacity: 0, y: 20, duration: 0.8, stagger: 0.2 });
  if (scene) {
    gsap.to(scene.state, { heart: 1, ease: 'none', scrollTrigger: { trigger: '#closing', start: 'top 60%', end: 'center center', scrub: 1.5 } });
  }
  $('#againBtn').addEventListener('click', () => {
    if (lenis) lenis.scrollTo('#letter', { duration: 3 });
    else $('#letter').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  // scroll velocity becomes a breeze through the petals
  if (scene) {
    gsap.ticker.add(() => {
      const v = lenis ? lenis.velocity : 0;
      scene.state.wind += (gsap.utils.clamp(-6, 6, v * 0.08) - scene.state.wind) * 0.06;
    });
  }
}

function setupCursor() {
  if (mobile) return;
  const g = $('.cursor-glow');
  const x = gsap.quickTo(g, 'x', { duration: 0.6, ease: 'power3' });
  const y = gsap.quickTo(g, 'y', { duration: 0.6, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); });
}

boot();
