// devis-init.js, Devis page initialization
document.addEventListener('DOMContentLoaded', () => {
    const P = window.Portfolio;

    // Theme, FAQ, smooth scroll, form (via shared.js)
    P.initTheme();
    P.initFaqAccordion();
    P.initSmoothScroll();
    P.initContactForm('devis-form', 'Google Ads');
    P.initCookieBannerObserver();

    // Manage cookies link
    const mc = document.getElementById('manageCookiesLink');
    if (mc) mc.addEventListener('click', e => { e.preventDefault(); if (window.resetCookieConsent) window.resetCookieConsent(); });

    // Google Ads conversion tracking (post-submit hook)
    const form = document.getElementById('devis-form');
    if (form) {
        form.addEventListener('submit', () => {
            // TODO: remplacer AW-XXXXXXXXX/XXXXXXX par l'ID de conversion Google Ads
            if (typeof gtag === 'function' && localStorage.getItem('mg_cookie_consent') === 'granted') {
                gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXXXX' });
            }
        });
    }

    // Scroll reveal
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.05 });
    document.querySelectorAll('.trust-item, .service-card, .testimonial-card, .process-step, .faq-item').forEach(el => {
        el.classList.add('reveal-el');
        revealObserver.observe(el);
    });
});
