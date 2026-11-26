'use strict';

(() => {
  const THEME_KEY = 'unsika-techfest-theme';

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
          badge: 'text-bg-secondary',
        },
        {
          time: '09.30 – 10.30',
          session: 'Design System yang Konsisten di Skala Tim',
          speaker: 'Nadia Kusuma',
          room: 'Auditorium Utama',
          track: 'Web Modern',
          badge: 'text-bg-primary',
        },
        {
          time: '11.00 – 12.00',
          session: 'Integrasi LLM ke Aplikasi Web Kampus',
          speaker: 'Dr. Rahmawati',
          room: 'Auditorium Utama',
          track: 'AI & Cloud',
          badge: 'text-bg-warning',
        },
        {
          time: '13.30 – 14.30',
          session: 'Mengamankan Form Web & Aset CDN',
          speaker: 'Farhan Hakim',
          room: 'Auditorium Utama',
          track: 'Cyber Security',
          badge: 'text-bg-danger',
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
          badge: 'text-bg-primary',
        },
        {
          time: '13.00 – 14.30',
          session: 'Alur Git Profesional: PR Review & Otomasi Rilis Tag',
          speaker: 'Dimas Nugroho',
          room: 'Lab Informatika B',
          track: 'AI & Cloud',
          badge: 'text-bg-warning',
        },
        {
          time: '15.00 – 16.00',
          session: 'Audit Supply Chain & Secret Scanning di GitHub',
          speaker: 'Sinta Maharani',
          room: 'Auditorium Utama',
          track: 'Cyber Security',
          badge: 'text-bg-danger',
        },
        {
          time: '16.00 – 17.00',
          session: 'Demo Day Proyek Mahasiswa & Penutupan',
          speaker: 'Dewan Mentor & Panitia',
          room: 'Auditorium Utama',
          track: 'Umum',
          badge: 'text-bg-secondary',
        },
      ],
    },
  };

  /**
   * Resolve initial theme from localStorage or system preference.
   * @returns {'light' | 'dark'}
   */
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
      btn.setAttribute(
        'aria-label',
        isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'
      );

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
   * Close mobile offcanvas smoothly when a section link is clicked.
   */
  function initOffcanvasNavigation() {
    const offcanvasEl = document.getElementById('mobileMenuOffcanvas');
    if (!offcanvasEl || typeof bootstrap === 'undefined') return;

    offcanvasEl.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
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
    if (typeof bootstrap === 'undefined') return;

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      new bootstrap.Tooltip(el);
    });

    document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
      new bootstrap.Popover(el);
    });
  }

  /**
   * Filter speaker cards via Button Group without layout artifacts.
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

      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('d-none', !match);
      });
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
   * Live Conference Pass preview + Bootstrap 5.3 form validation & Toast (Modul 5.6, 5.8, 5.10-5.12).
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
        if (toastEl && typeof bootstrap !== 'undefined') {
          bootstrap.Toast.getOrCreateInstance(toastEl).show();
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

  document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initOffcanvasNavigation();
    initTooltipsAndPopovers();
    initSpeakerFilters();
    initSpeakerModal();
    initSchedulePagination();
    initRegistrationForm();
  });
})();
