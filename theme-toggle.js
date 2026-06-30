// theme-toggle.js — Minimal dark mode for secondary pages
(function () {
    'use strict';
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    function updateThemeUI(theme) {
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    }
    updateThemeUI(document.documentElement.getAttribute('data-theme') || 'light');
    if (toggle) toggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeUI(next);
    });
})();
