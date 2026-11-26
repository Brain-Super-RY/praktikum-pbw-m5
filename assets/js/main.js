'use strict';

const THEME_KEY = 'unsika-techfest-theme';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SCHEDULE_DATA = {
  1: {
    label: 'Hari 1 (19 Desember 2026) — Seminar Utama & Keynote',
    rows: [
      {
        time: '08.30 – 09.30',
        session: 'Registrasi Ulang & Pembukaan Dekan Fasilkom',
        speaker: 'Panitia UNSIKA TechFest',
        room: 'Auditorium Utama',
        track: 'Umum',
        badge: 'tf-badge-cobalt',
      },
      {
        time: '09.30 – 10.30',
        session: 'Design System yang Konsisten di Skala Tim',
        speaker: 'Nadia Kusuma',
        room: 'Auditorium Utama',
        track: 'Web Modern',
        badge: 'tf-badge-lime',
      },
      {
        time: '11.00 – 12.00',
        session: 'Integrasi LLM ke Aplikasi Web Kampus',
        speaker: 'Dr. Rahmawati',
        room: 'Auditorium Utama',
        track: 'AI & Cloud',
        badge: 'tf-badge-cobalt',
      },
      {
        time: '13.30 – 14.30',
        session: 'Mengamankan Form Web & Aset CDN',
        speaker: 'Farhan Hakim',
        room: 'Auditorium Utama',
        track: 'Cyber Security',
        badge: 'tf-badge-cobalt',
      },
    ],
  },
  2: {
    label: 'Hari 2 (20 Desember 2026) — Hands-on Workshop & Demo Day',
    rows: [
      {
        time: '09.00 – 11.00',
        session: 'Bootstrap 5.3 Tanpa Bloat: Grid, Dark Mode & Validasi',
        speaker: 'Bagas Pratama',
        room: 'Lab Informatika A',
        track: 'Web Modern',
        badge: 'tf-badge-lime',
      },
      {
        time: '13.00 – 14.30',
        session: 'Alur Git Profesional: PR Review & Otomasi Rilis Tag',
        speaker: 'Dimas Nugroho',
        room: 'Lab Informatika B',
        track: 'AI & Cloud',
        badge: 'tf-badge-cobalt',
      },
      {
        time: '15.00 – 16.00',
        session: 'Audit Supply Chain & Secret Scanning di GitHub',
        speaker: 'Sinta Maharani',
        room: 'Auditorium Utama',
        track: 'Cyber Security',
        badge: 'tf-badge-cobalt',
      },
      {
        time: '16.00 – 17.00',
        session: 'Demo Day Proyek Mahasiswa & Penutupan',
        speaker: 'Dewan Mentor & Panitia',
        room: 'Auditorium Utama',
        track: 'Umum',
        badge: 'tf-badge-cobalt',
      },
    ],
  },
};

const LEVEL_LABELS = {
  1: 'Level 1: Pemula',
  2: 'Level 2: Dasar',
  3: 'Level 3: Menengah',
  4: 'Level 4: Lanjut',
  5: 'Level 5: Mahir',
};

const TRACK_PREFIX = {
  'Web Modern': 'WEB',
  'AI & Cloud': 'AIC',
  'Cyber Security': 'SEC',
};

let lenisInstance = null;

/**
 * Resolve initial theme from localStorage, defaulting to cyber dark mode.
 * @returns {'light' | 'dark'}
 */
function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return 'dark';
}

/**
 * Apply Bootstrap 5.3 color mode and sync toggle buttons.
 * @param {'light' | 'dark'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  const isDark = theme === 'dark';

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');

    const icon = btn.querySelector('[data-theme-icon]');
    const label = btn.querySelector('[data-theme-label]');

    if (icon) {
      icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
    if (label) {
      label.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
    }
  });
}

function initThemeSwitcher() {
  applyTheme(getPreferredTheme());

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  });
}

/**
 * Split heading text nodes into word masks while preserving highlight spans (e.g. .tf-text-lime).
 * @param {HTMLElement} heading
 * @returns {HTMLElement[]}
 */
function splitWordsInHeading(heading) {
  const originalText = heading.textContent.replace(/\s+/g, ' ').trim();
  heading.setAttribute('aria-label', originalText);

  const wordEls = [];

  function processNode(node, parentTarget) {
    if (node.nodeType === Node.TEXT_NODE) {
      const tokens = node.textContent.split(/(\s+)/);
      tokens.forEach((token) => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          parentTarget.appendChild(document.createTextNode(' '));
          return;
        }
        const mask = document.createElement('span');
        mask.className = 'tf-word-mask';
        mask.setAttribute('aria-hidden', 'true');

        const word = document.createElement('span');
        word.className = 'tf-word';
        word.textContent = token;

        mask.appendChild(word);
        parentTarget.appendChild(mask);
        wordEls.push(word);
      });
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      Array.from(node.childNodes).forEach((child) => processNode(child, clone));
      parentTarget.appendChild(clone);
    }
  }

  const fragment = document.createDocumentFragment();
  Array.from(heading.childNodes).forEach((child) => processNode(child, fragment));
  heading.replaceChildren(fragment);

  return wordEls;
}

/**
 * Initialize Lenis smooth scroll + GSAP ScrollTrigger sync + word-by-word heading reveals.
 */
function initLenisAndGsap() {
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  if (hasGsap && hasScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  if (hasLenis) {
    lenisInstance = new window.Lenis({
      autoRaf: false,
      lerp: prefersReducedMotion ? 0.18 : 0.1,
      smoothWheel: true,
    });

    if (hasGsap && hasScrollTrigger) {
      lenisInstance.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const rafLoop = (time) => {
        lenisInstance.raf(time);
        requestAnimationFrame(rafLoop);
      };
      requestAnimationFrame(rafLoop);
    }

    // Pause Lenis while Bootstrap modals or offcanvas drawers are open
    ['speakerModal', 'mobileMenuOffcanvas'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const prefix = id === 'speakerModal' ? 'bs.modal' : 'bs.offcanvas';
      el.addEventListener(`show.${prefix}`, () => lenisInstance && lenisInstance.stop());
      el.addEventListener(`hidden.${prefix}`, () => lenisInstance && lenisInstance.start());
    });
  }

  // Smooth anchor scrolling via Lenis (falls back cleanly if Lenis is absent)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || anchor.dataset.bsToggle === 'dropdown') return;

      const target = document.querySelector(href);
      if (!target) return;

      if (lenisInstance) {
        event.preventDefault();
        lenisInstance.scrollTo(target, { offset: -84 });
      }
    });
  });

  if (!hasGsap) return;

  const wordYOffset = prefersReducedMotion ? 35 : 110;

  // Word-by-word reveals on [data-split-words] headings
  document.querySelectorAll('[data-split-words]').forEach((heading) => {
    const words = splitWordsInHeading(heading);
    if (words.length === 0) return;

    const isHero = heading.tagName === 'H1';
    if (isHero || !hasScrollTrigger) {
      window.gsap.from(words, {
        yPercent: wordYOffset,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    } else {
      window.gsap.from(words, {
        scrollTrigger: {
          trigger: heading,
          start: 'top 90%',
          once: true,
        },
        yPercent: wordYOffset,
        opacity: 0,
        duration: 0.65,
        stagger: 0.055,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }
  });

  // Continuous HUD seal rotation & scroll parallax (gated for vestibular comfort)
  if (!prefersReducedMotion) {
    if (document.querySelector('.tf-hud-seal')) {
      window.gsap.to('.tf-hud-seal', {
        rotation: 360,
        duration: 22,
        repeat: -1,
        ease: 'none',
      });
    }

    if (hasScrollTrigger && document.querySelector('.tf-hero-halo')) {
      window.gsap.to('.tf-hero-halo', {
        scrollTrigger: {
          trigger: '#beranda',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 22,
        ease: 'none',
      });
    }
  }

  // Refresh ScrollTrigger once fonts/images settle
  window.addEventListener('load', () => {
    if (hasScrollTrigger) window.ScrollTrigger.refresh();
  });
}

/**
 * Initialize Motion inView entrance and hover animations on .tf-motion-card elements.
 */
async function initMotionCards() {
  const cards = Array.from(document.querySelectorAll('.tf-motion-card'));
  if (cards.length === 0) return;

  try {
    const { animate, inView } = await import(
      'https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm'
    );

    const revealed = new WeakSet();
    const enterY = prefersReducedMotion ? 8 : 20;
    const hoverY = prefersReducedMotion ? -4 : -6;
    const hoverScale = prefersReducedMotion ? 1.01 : 1.015;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.92;

      if (!alreadyVisible) {
        card.style.opacity = '0';
        card.style.transform = `translateY(${enterY}px) scale(0.98)`;
      }

      inView(
        card,
        () => {
          if (revealed.has(card)) return;
          revealed.add(card);
          animate(
            card,
            { opacity: [Number(card.style.opacity || 0), 1], y: [enterY, 0], scale: [0.98, 1] },
            { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { amount: 0.08 }
      );

      card.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        animate(
          card,
          { y: hoverY, scale: hoverScale },
          { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
        );
      });

      card.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'touch') return;
        animate(card, { y: 0, scale: 1 }, { duration: 0.25, ease: [0.22, 1, 0.36, 1] });
      });
    });
  } catch {
    // Graceful fallback: keep all cards cleanly visible if Motion ESM cannot load
    cards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
  }
}

/**
 * Close mobile offcanvas smoothly when a section link is clicked.
 */
function initOffcanvasNavigation() {
  const offcanvasEl = document.getElementById('mobileMenuOffcanvas');
  if (!offcanvasEl || typeof window.bootstrap === 'undefined') return;

  offcanvasEl.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (instance) {
        instance.hide();
      }
    });
  });
}

/**
 * Initialize opt-in Bootstrap Tooltips and Popovers (Modul 5.8).
 */
function initTooltipsAndPopovers() {
  if (typeof window.bootstrap === 'undefined') return;

  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    new window.bootstrap.Tooltip(el);
  });

  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
    new window.bootstrap.Popover(el);
  });
}

/**
 * Filter speaker cards via Button Group and refresh ScrollTrigger layout.
 */
function initSpeakerFilters() {
  const group = document.getElementById('speakerFilterGroup');
  const cards = document.querySelectorAll('[data-speaker-card]');
  if (!group || cards.length === 0) return;

  group.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-filter]');
    if (!btn) return;

    const filter = btn.dataset.filter;

    group.querySelectorAll('button[data-filter]').forEach((item) => {
      const isActive = item === btn;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    cards.forEach((col) => {
      const match = filter === 'all' || col.dataset.category === filter;
      col.classList.toggle('d-none', !match);
      if (match) {
        const motionCard = col.querySelector('.tf-motion-card');
        if (motionCard) {
          motionCard.style.opacity = '1';
          motionCard.style.transform = 'none';
        }
      }
    });

    if (typeof window.ScrollTrigger !== 'undefined') {
      window.ScrollTrigger.refresh();
    }
  });
}

/**
 * Populate Speaker Detail Modal safely via textContent on show.bs.modal.
 */
function initSpeakerModal() {
  const modalEl = document.getElementById('speakerModal');
  if (!modalEl) return;

  modalEl.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    if (!trigger) return;

    const setText = (id, value) => {
      const target = document.getElementById(id);
      if (target) target.textContent = value || '';
    };

    setText('speakerModalName', trigger.dataset.speakerName);
    setText('speakerModalRole', trigger.dataset.speakerRole);
    setText('speakerModalTrack', trigger.dataset.speakerTrack);
    setText('speakerModalTopic', trigger.dataset.speakerTopic);
    setText('speakerModalTime', trigger.dataset.speakerTime);
    setText('speakerModalAbstract', trigger.dataset.speakerAbstract);
  });
}

/**
 * Render schedule table rows safely and handle Day 1 / Day 2 pagination.
 */
function initSchedulePagination() {
  const tbody = document.getElementById('scheduleTableBody');
  const dayLabel = document.getElementById('scheduleDayLabel');
  const pagination = document.getElementById('schedulePagination');
  if (!tbody || !dayLabel || !pagination) return;

  let currentDay = 1;

  function renderDay(day) {
    const data = SCHEDULE_DATA[day];
    if (!data) return;

    currentDay = day;
    dayLabel.textContent = data.label;

    tbody.replaceChildren(
      ...data.rows.map((row) => {
        const tr = document.createElement('tr');

        const tdTime = document.createElement('td');
        tdTime.className = 'font-mono-code text-nowrap';
        tdTime.textContent = row.time;

        const tdSession = document.createElement('td');
        tdSession.className = 'fw-semibold';
        tdSession.textContent = row.session;

        const tdSpeaker = document.createElement('td');
        tdSpeaker.textContent = row.speaker;

        const tdRoom = document.createElement('td');
        tdRoom.textContent = row.room;

        const tdTrack = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `badge ${row.badge}`;
        badge.textContent = row.track;
        tdTrack.appendChild(badge);

        tr.append(tdTime, tdSession, tdSpeaker, tdRoom, tdTrack);
        return tr;
      })
    );

    pagination.querySelectorAll('li[data-page]').forEach((li) => {
      const active = Number(li.dataset.page) === day;
      li.classList.toggle('active', active);
      if (active) {
        li.setAttribute('aria-current', 'page');
      } else {
        li.removeAttribute('aria-current');
      }
    });

    const prevItem = pagination.querySelector('[data-page-prev]');
    const nextItem = pagination.querySelector('[data-page-next]');
    if (prevItem) prevItem.classList.toggle('disabled', day <= 1);
    if (nextItem) nextItem.classList.toggle('disabled', day >= 2);
  }

  pagination.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    const li = btn.closest('li');
    if (!li || li.classList.contains('disabled')) return;

    if (li.hasAttribute('data-page-prev')) {
      renderDay(Math.max(1, currentDay - 1));
    } else if (li.hasAttribute('data-page-next')) {
      renderDay(Math.min(2, currentDay + 1));
    } else if (li.dataset.page) {
      renderDay(Number(li.dataset.page));
    }
  });
}

/**
 * Compute a deterministic ticket code from participant name and track.
 * @param {string} name
 * @param {string} track
 * @returns {string}
 */
function buildTicketCode(name, track) {
  const prefix = TRACK_PREFIX[track] || 'GEN';
  const clean = (name || '').trim();
  if (!clean) return `UTF26-${prefix}-001`;
  let sum = 0;
  for (let i = 0; i < clean.length; i += 1) {
    sum = (sum + clean.charCodeAt(i) * (i + 1)) % 900;
  }
  return `UTF26-${prefix}-${String(100 + sum)}`;
}

/**
 * Live HUD QR Pass preview + Bootstrap 5.3 form validation & Toast (Modul 5.6, 5.8, 5.10-5.12).
 */
function initRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const nameInput = document.getElementById('regName');
  const githubInput = document.getElementById('regGithub');
  const trackSelect = document.getElementById('regTrack');
  const levelRange = document.getElementById('regLevel');
  const levelBadge = document.getElementById('regLevelBadge');
  const submitBtn = document.getElementById('regSubmitBtn');
  const submitLabel = document.getElementById('regSubmitLabel');
  const spinner = document.getElementById('regSpinner');
  const toastEl = document.getElementById('registrationToast');
  const toastMessage = document.getElementById('toastMessage');

  const passName = document.getElementById('passName');
  const passGithub = document.getElementById('passGithub');
  const passTrack = document.getElementById('passTrack');
  const passCategory = document.getElementById('passCategory');
  const passLevel = document.getElementById('passLevel');
  const passCode = document.getElementById('passCode');

  function syncLivePass() {
    const rawName = nameInput ? nameInput.value.trim() : '';
    const rawGithub = githubInput ? githubInput.value.trim().replace(/^@+/, '') : '';
    const trackVal = trackSelect ? trackSelect.value : '';
    const selectedCat = form.querySelector('input[name="regCategory"]:checked');
    const levelVal = levelRange ? Number(levelRange.value) : 2;
    const levelText = LEVEL_LABELS[levelVal] || LEVEL_LABELS[2];

    if (levelBadge) levelBadge.textContent = levelText;
    if (passName) passName.textContent = rawName || 'Nama Peserta';
    if (passGithub) passGithub.textContent = `@${rawGithub || 'username'}`;
    if (passTrack) passTrack.textContent = trackVal || 'Belum dipilih';
    if (passCategory) {
      passCategory.textContent = selectedCat ? selectedCat.value : 'Mahasiswa UNSIKA';
    }
    if (passLevel) passLevel.textContent = levelText;
    if (passCode) passCode.textContent = buildTicketCode(rawName, trackVal);
  }

  form.addEventListener('input', syncLivePass);
  form.addEventListener('change', syncLivePass);
  syncLivePass();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add('was-validated');
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const participantName = nameInput ? nameInput.value.trim() : 'Peserta';
    const chosenTrack = trackSelect ? trackSelect.value : 'Umum';
    const ticketCode = buildTicketCode(participantName, chosenTrack);

    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('d-none');
    if (submitLabel) submitLabel.textContent = 'Memproses Tiket...';

    window.setTimeout(() => {
      if (toastMessage) {
        toastMessage.textContent = `Tiket berhasil dipesan untuk ${participantName} (${chosenTrack}) · Kode ${ticketCode}`;
      }
      if (toastEl && typeof window.bootstrap !== 'undefined') {
        window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
      }

      if (submitBtn) submitBtn.disabled = false;
      if (spinner) spinner.classList.add('d-none');
      if (submitLabel) submitLabel.textContent = 'Ambil Tiket Gratis';

      form.reset();
      form.classList.remove('was-validated');
      syncLivePass();
    }, 500);
  });
}

function initAll() {
  initThemeSwitcher();
  initOffcanvasNavigation();
  initTooltipsAndPopovers();
  initSpeakerFilters();
  initSpeakerModal();
  initSchedulePagination();
  initRegistrationForm();
  initLenisAndGsap();
  initMotionCards();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
