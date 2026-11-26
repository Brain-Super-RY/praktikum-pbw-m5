'use strict';

(() => {
  const THEME_KEY = 'unsika-techfest-theme';

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

  document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initOffcanvasNavigation();
  });
})();
