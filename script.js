document.addEventListener("DOMContentLoaded", () => {
    const P = window.Portfolio;

    // ========================
    // Theme (via shared.js)
    // ========================
    P.initTheme();
    P.initServiceTabs();
    P.initHeroTyping();

    // ========================
    // Hero scroll indicator click
    // ========================
    const scrollIndicator = document.querySelector(".hero-scroll-indicator");
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", () => {
            const nextSection = document.querySelector(".hero + section, .hero + .trust");
            if (nextSection) nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    // ========================
    // Navbar scroll
    // ========================
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 30);
    }, { passive: true });

    // ========================
    // Mobile menu
    // ========================
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    function closeMenu() {
        navToggle?.classList.remove("active");
        navMenu?.classList.remove("active");
        navToggle?.setAttribute("aria-expanded", "false");
        navToggle?.focus();
    }

    navToggle?.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
        const isOpen = navToggle.classList.contains("active");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-link").forEach((link) =>
        link.addEventListener("click", closeMenu)
    );

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) closeMenu();
        }, 150);
    });

    // ========================
    // Focus trap (mobile menu)
    // ========================
    document.addEventListener("keydown", (e) => {
        if (!navMenu?.classList.contains("active")) return;
        // Échap ferme le menu et rend le focus au hamburger (closeMenu() fait navToggle.focus()).
        if (e.key === "Escape") { closeMenu(); return; }
        if (e.key !== "Tab") return;

        const focusable = [
            navToggle,
            ...navMenu.querySelectorAll("a, button"),
        ].filter(Boolean);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // ========================
    // Scroll reveal
    // ========================
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    const selectors = [
        ".trust-item",
        ".about-content",
        ".about-values",
        ".value-card",
        ".service-card",
        ".portfolio-card",
        ".testimonial-card",
        ".process-step",
        ".faq-item",
        ".contact-form",
        ".contact-aside",
        ".aside-card",
    ];

    let delay = 0;
    document.querySelectorAll(selectors.join(", ")).forEach((el) => {
        el.classList.add("reveal-el");
        el.style.transitionDelay = `${delay}s`;
        delay = Math.min(delay + 0.04, 0.2);
        revealObserver.observe(el);
    });

    document.querySelectorAll(".section-header").forEach((header) => {
        header.classList.add("reveal-el");
        header.style.transitionDelay = "0s";
        revealObserver.observe(header);
    });

    // ========================
    // Lazy hero card animations
    // ========================
    const heroVisual = document.querySelector(".hero-visual");
    if (heroVisual) {
        const heroObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    heroVisual.classList.toggle("hero-card-animated", entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );
        heroObserver.observe(heroVisual);
    }

    // ========================
    // Track outbound clicks (réalisations : Viet Wok, PRO-REFLEX, SCOLIA)
    // ========================
    document.querySelectorAll('.portfolio-link').forEach((link) => {
        link.addEventListener('click', () => {
            P.trackEvent('outbound_click', {
                destination: link.href,
                label: link.getAttribute('aria-label') || link.textContent.trim().slice(0, 50),
            });
            if (link.dataset.demo) P.trackEvent('demo_view', { demo_name: link.dataset.demo });
        });
    });

    // CTA + liens de contact (mutualisés via shared.js, exclut le submit)
    P.initCtaTracking();
    P.initContactLinkTracking();

    // ========================
    // FAQ Accordion (via shared.js, handles ARIA)
    // ========================
    P.initFaqAccordion();

    // ========================
    // Floating CTA
    // ========================
    const floatingCta = document.getElementById("floatingCta");
    if (floatingCta) {
        window.addEventListener("scroll", () => {
            floatingCta.classList.toggle("show", window.scrollY > 600);
        }, { passive: true });
    }

    // ========================
    // Contact form (via shared.js, handles validation + ARIA)
    // ========================
    P.initContactForm('contact-form', null);

    // ========================
    // Smooth scroll (via shared.js)
    // ========================
    P.initSmoothScroll();

    // ========================
    // Cookie banner CTA collision (via shared.js)
    // ========================
    P.initCookieBannerObserver();

    // ========================
    // Couche "vivant par le mouvement", le site répond au curseur
    // (désactivée si prefers-reduced-motion ou pas de pointeur fin / tactile)
    // ========================
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (finePointer && !reduceMotion) {
        // --- Tilt 3D des cartes au survol (réagit à la position du curseur) ---
        document.querySelectorAll(".service-card, .portfolio-card, .value-card, .testimonial-card").forEach((card) => {
            const MAX = 6;
            card.addEventListener("pointerenter", () => {
                card.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease";
            });
            card.addEventListener("pointermove", (e) => {
                const r = card.getBoundingClientRect();
                const rx = (0.5 - (e.clientY - r.top) / r.height) * MAX;
                const ry = ((e.clientX - r.left) / r.width - 0.5) * MAX;
                card.style.transform =
                    `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
            });
            card.addEventListener("pointerleave", () => {
                card.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.3s ease";
                card.style.transform = "";
            });
        });

        // --- Boutons magnétiques (attraction douce vers le curseur) ---
        document.querySelectorAll(".btn-primary, .nav-cta").forEach((btn) => {
            const STR = 0.3;
            btn.addEventListener("pointerenter", () => {
                btn.style.transition = "transform 0.15s ease-out, box-shadow 0.3s ease";
            });
            btn.addEventListener("pointermove", (e) => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * STR;
                const y = (e.clientY - r.top - r.height / 2) * STR;
                btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
            });
            btn.addEventListener("pointerleave", () => {
                btn.style.transition = "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease";
                btn.style.transform = "";
            });
        });

        // --- Parallaxe du groupe de cartes hero (suit le curseur, avec inertie) ---
        // Réutilise heroVisual déjà requêté plus haut (évite une 2e requête DOM).
        const hero = document.querySelector(".hero");
        if (hero && heroVisual) {
            let tX = 0, tY = 0, cX = 0, cY = 0, raf = null;
            const tick = () => {
                cX += (tX - cX) * 0.08;
                cY += (tY - cY) * 0.08;
                heroVisual.style.transform = `translate(${cX.toFixed(2)}px, ${cY.toFixed(2)}px)`;
                raf = (Math.abs(tX - cX) > 0.1 || Math.abs(tY - cY) > 0.1) ? requestAnimationFrame(tick) : null;
            };
            hero.addEventListener("pointermove", (e) => {
                const r = hero.getBoundingClientRect();
                tX = ((e.clientX - r.left) / r.width - 0.5) * 24;
                tY = ((e.clientY - r.top) / r.height - 0.5) * 18;
                if (!raf) raf = requestAnimationFrame(tick);
            }, { passive: true });
            hero.addEventListener("pointerleave", () => {
                tX = 0; tY = 0;
                if (!raf) raf = requestAnimationFrame(tick);
            });
        }
    }
});
