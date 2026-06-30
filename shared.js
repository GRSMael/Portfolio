/**
 * shared.js, Fonctions communes Portfolio Maël Grosa
 * Utilisé par index.html (via script.js) et devis.html
 * Pattern IIFE → window.Portfolio
 */
(function () {
    'use strict';

    // ========================
    // Theme
    // ========================
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label',
                theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
            );
        }
    }

    function initTheme() {
        setTheme(getPreferredTheme());

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                setTheme(current === 'dark' ? 'light' : 'dark');
            });
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // ========================
    // Toast
    // ========================
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        const span = toast.querySelector('span');
        const icon = toast.querySelector('i');
        span.textContent = message;

        if (type === 'error') {
            toast.style.background = '#ef4444';
            icon.className = 'fas fa-exclamation-circle';
        } else {
            toast.style.background = '';
            icon.className = 'fas fa-check-circle';
        }

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // ========================
    // FAQ Accordion (with ARIA)
    // ========================
    function initFaqAccordion() {
        document.querySelectorAll('.faq-question').forEach((btn) => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const isActive = item.classList.contains('active');

                // Close all & reset aria
                document.querySelectorAll('.faq-item').forEach((faq) => {
                    faq.classList.remove('active');
                    const faqBtn = faq.querySelector('.faq-question');
                    if (faqBtn) faqBtn.setAttribute('aria-expanded', 'false');
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ========================
    // Smooth Scroll
    // ========================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // ========================
    // GA4 Events (consent-aware)
    // ========================
    function trackEvent(eventName, params) {
        if (typeof gtag === 'function' && localStorage.getItem('mg_cookie_consent') === 'granted') {
            gtag('event', eventName, params || {});
        }
    }

    // ========================
    // Contact Form (with accessible validation)
    // ========================
    function initContactForm(formId, source) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Clear aria-invalid on input
        form.querySelectorAll('input, textarea, select').forEach((field) => {
            field.addEventListener('input', () => {
                field.removeAttribute('aria-invalid');
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot anti-spam check
            const honeypot = form.querySelector('[name="website_url"]');
            if (honeypot && honeypot.value) return;

            // Rate limiting (1 submission per 60 seconds)
            const lastSubmit = parseInt(sessionStorage.getItem('mg_last_submit') || '0', 10);
            if (Date.now() - lastSubmit < 60000) {
                showToast('Veuillez patienter avant de renvoyer le formulaire.', 'error');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;

            const fromName = form.querySelector('[name="from_name"]').value.trim();
            const fromEmail = form.querySelector('[name="from_email"]').value.trim();
            const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
            const message = form.querySelector('[name="message"]').value.trim();
            const projectType = form.querySelector('[name="project_type"]')?.value || '';

            // Validation: name + message required
            if (!fromName || !message) {
                const firstEmpty = !fromName
                    ? form.querySelector('[name="from_name"]')
                    : form.querySelector('[name="message"]');
                if (!fromName) form.querySelector('[name="from_name"]').setAttribute('aria-invalid', 'true');
                if (!message) form.querySelector('[name="message"]').setAttribute('aria-invalid', 'true');
                showToast('Veuillez remplir votre nom et décrire votre projet.', 'error');
                firstEmpty.focus();
                return;
            }

            // Validation: email format (if provided)
            if (fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
                form.querySelector('[name="from_email"]').setAttribute('aria-invalid', 'true');
                showToast('Veuillez entrer une adresse email valide.', 'error');
                form.querySelector('[name="from_email"]').focus();
                return;
            }

            // Validation: email OR phone required
            if (!fromEmail && !phone) {
                const emailField = form.querySelector('[name="from_email"]');
                const phoneField = form.querySelector('[name="phone"]');
                if (emailField) emailField.setAttribute('aria-invalid', 'true');
                if (phoneField) phoneField.setAttribute('aria-invalid', 'true');
                showToast('Renseignez au moins un moyen de contact (email ou téléphone).', 'error');
                if (emailField) emailField.focus();
                return;
            }

            // Build message with phone included
            const fullMessage = phone
                ? `${message}\n\n📞 Téléphone: ${phone}`
                : message;

            const fromNameFinal = source ? `${fromName} [${source}]` : fromName;

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

            try {
                if (!window.WEB3FORMS_KEY) {
                    throw new Error('Clé Web3Forms manquante');
                }

                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        access_key: window.WEB3FORMS_KEY,
                        subject: `Nouveau message du site : ${fromNameFinal}`,
                        from_name: fromNameFinal,
                        email: fromEmail || 'non renseigné',
                        phone: phone || 'Non renseigné',
                        project_type: projectType || 'Non précisé',
                        message: fullMessage,
                    }),
                });
                const json = await res.json();

                if (json.success) {
                    const formType = source ? 'devis_ads' : 'contact';
                    trackEvent('form_submit', { form_type: formType, project_type: projectType });
                    showToast('Demande envoyée ! Je vous réponds sous 24h. 🎉');
                    form.reset();
                    sessionStorage.setItem('mg_last_submit', Date.now().toString());
                } else {
                    throw new Error(json.message || "Échec de l'envoi");
                }
            } catch (err) {
                console.error('Erreur formulaire:', err);
                showToast("Erreur d'envoi. Écrivez-moi à contact@grosamael.fr", 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = original;
            }
        });
    }

    // ========================
    // Hero Typing Effect
    // ========================
    function initHeroTyping() {
        const el = document.querySelector('.hero-typed');
        if (!el) return;

        const words = [
            'convertissent',
            'génèrent des leads',
            'dominent Google',
            'automatisent votre croissance'
        ];
        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 40;
        const pauseAfterType = 2000;
        const pauseAfterDelete = 400;

        function tick() {
            const current = words[wordIdx];

            if (!isDeleting) {
                charIdx++;
                el.textContent = current.slice(0, charIdx);

                if (charIdx === current.length) {
                    isDeleting = true;
                    setTimeout(tick, pauseAfterType);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                charIdx--;
                el.textContent = current.slice(0, charIdx);

                if (charIdx === 0) {
                    isDeleting = false;
                    wordIdx = (wordIdx + 1) % words.length;
                    setTimeout(tick, pauseAfterDelete);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }

        // Start after a brief delay
        setTimeout(tick, 600);
    }

    // ========================
    // Service Tabs
    // ========================
    function initServiceTabs() {
        const tabs = document.querySelectorAll('.service-tab');
        if (!tabs.length) return;

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const panelId = tab.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                if (!panel) return;

                // Deactivate all tabs & hide all panels
                tabs.forEach((t) => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                document.querySelectorAll('.services-grid[role="tabpanel"]').forEach((p) => {
                    p.hidden = true;
                });

                // Activate clicked tab & show panel
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                panel.hidden = false;
            });
        });

        // Keyboard navigation (arrow keys)
        const tabList = document.querySelector('.service-tabs');
        if (tabList) {
            tabList.addEventListener('keydown', (e) => {
                const tabsArr = [...tabs];
                const idx = tabsArr.indexOf(document.activeElement);
                if (idx === -1) return;

                let newIdx;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    newIdx = (idx + 1) % tabsArr.length;
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    newIdx = (idx - 1 + tabsArr.length) % tabsArr.length;
                } else {
                    return;
                }

                e.preventDefault();
                tabsArr[newIdx].focus();
                tabsArr[newIdx].click();
            });
        }
    }

    // ========================
    // Cookie banner CTA collision observer
    // ========================
    function initCookieBannerObserver() {
        const observer = new MutationObserver(() => {
            const banner = document.getElementById('mg-cookie-banner');
            const hasBanner = !!banner;
            document.body.classList.toggle('cookie-banner-visible', hasBanner);
            // Disconnect once banner is definitively removed (user made a choice)
            if (!hasBanner && localStorage.getItem('mg_cookie_consent')) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========================
    // Export
    // ========================
    window.Portfolio = {
        getPreferredTheme,
        setTheme,
        initTheme,
        showToast,
        initFaqAccordion,
        initSmoothScroll,
        trackEvent,
        initContactForm,
        initCookieBannerObserver,
        initServiceTabs,
        initHeroTyping,
    };
})();
