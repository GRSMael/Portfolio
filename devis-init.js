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

    // Tracking CTA + liens de contact (mutualisés via shared.js)
    P.initCtaTracking();
    P.initContactLinkTracking();

    // Suivi de conversion Google Ads — déclenché sur SUCCÈS RÉEL d'envoi.
    // shared.js émet l'event "mg:lead-success" UNIQUEMENT après la réponse OK de
    // Web3Forms (jamais sur le simple submit). Pour activer le suivi, renseigne
    // ADS_CONVERSION_SEND_TO au format 'AW-XXXXXXXXX/leLabel' (action de conversion
    // "Lead/Devis" créée dans Google Ads). Tant que c'est null, aucun ping n'est envoyé.
    const ADS_CONVERSION_SEND_TO = null; // ex. 'AW-123456789/AbCdEfGh'
    const form = document.getElementById('devis-form');
    if (form) {
        form.addEventListener('mg:lead-success', () => {
            if (ADS_CONVERSION_SEND_TO && typeof gtag === 'function' && localStorage.getItem('mg_cookie_consent') === 'granted') {
                gtag('event', 'conversion', {
                    send_to: ADS_CONVERSION_SEND_TO,
                    value: 300,
                    currency: 'EUR',
                });
            }
            // Redirige vers la page de remerciement (UX claire + fiabilise la conversion Ads
            // via une URL dédiée). Léger délai pour laisser le toast de succès s'afficher.
            setTimeout(() => { window.location.assign('merci.html'); }, 1400);
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
