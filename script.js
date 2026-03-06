document.addEventListener("DOMContentLoaded", () => {
    // ========================
    // EmailJS
    // ========================
    if (window.emailJsConfig) {
        emailjs.init(window.emailJsConfig.publicKey);
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
    }

    navToggle?.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach((link) =>
        link.addEventListener("click", closeMenu)
    );

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) closeMenu();
    });

    // ========================
    // Scroll reveal (fixed — no blank spaces)
    // ========================
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target); // stop watching once revealed
                }
            });
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    function applyReveal() {
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

        const els = document.querySelectorAll(selectors.join(", "));
        let delay = 0;
        els.forEach((el) => {
            el.classList.add("reveal-el");
            el.style.transitionDelay = `${delay}s`;
            delay = Math.min(delay + 0.04, 0.2);
            revealObserver.observe(el);
        });

        // Section headers fade immediately (no blank space effect)
        document.querySelectorAll(".section-header").forEach((header) => {
            header.classList.add("reveal-el");
            header.style.transitionDelay = "0s";
            revealObserver.observe(header);
        });
    }

    // ========================
    // Portfolio Data
    // ========================
    const projects = [
        {
            title: "Viet Wok — Restaurant",
            desc: "Site vitrine coloré pour un restaurant vietnamien. Menu interactif avec photos, design pop et chaleureux, responsive et SEO optimisé.",
            image: "images/demo-restaurant.png",
            type: "Site Vitrine",
            link: "demos/restaurant/index.html",
        },
        {
            title: "Élégance — Salon de Coiffure",
            desc: "Site élégant pour un salon de coiffure parisien. Galerie photo, avis clients, réservation en ligne, palette crème et dorée.",
            image: "images/demo-coiffure.png",
            type: "Site Vitrine",
            link: "demos/artisan/index.html",
        },
        {
            title: "Claire Martin — Coach",
            desc: "Landing page de conversion pour une coach. Parcours client en 4 étapes, témoignages, prise de rendez-vous. Taux de conversion +120%.",
            image: "images/demo-coach.png",
            type: "Landing Page",
            link: "demos/landing/index.html",
        },
    ];

    function renderPortfolio() {
        const grid = document.getElementById("portfolioGrid");
        if (!grid) return;
        grid.innerHTML = "";
        projects.forEach((p) => {
            const card = document.createElement("article");
            card.className = "portfolio-card";
            card.innerHTML = `
        <div class="portfolio-img">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="portfolio-body">
          <span class="portfolio-type">${p.type}</span>
          <h3 class="portfolio-title">${p.title}</h3>
          <p class="portfolio-desc">${p.desc}</p>
          <div class="portfolio-footer">
            <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="portfolio-link">
              Voir le site <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
            grid.appendChild(card);
        });
    }
    renderPortfolio();

    // Init reveal AFTER portfolio is rendered
    applyReveal();

    // ========================
    // FAQ Accordion
    // ========================
    document.querySelectorAll(".faq-question").forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq-item");
            const isActive = item.classList.contains("active");

            // Close all
            document.querySelectorAll(".faq-item").forEach((faq) =>
                faq.classList.remove("active")
            );

            // Toggle current
            if (!isActive) item.classList.add("active");
        });
    });

    // ========================
    // Floating CTA (show after scrolling past hero)
    // ========================
    const floatingCta = document.getElementById("floatingCta");
    if (floatingCta) {
        window.addEventListener("scroll", () => {
            floatingCta.classList.toggle("show", window.scrollY > 600);
        }, { passive: true });
    }

    // ========================
    // Contact form
    // ========================
    const form = document.getElementById("contact-form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

            try {
                const data = {
                    from_name: form.querySelector('[name="from_name"]').value.trim(),
                    name: form.querySelector('[name="from_name"]').value.trim(),
                    from_email: form.querySelector('[name="from_email"]').value.trim(),
                    message: form.querySelector('[name="message"]').value.trim(),
                    project_type: form.querySelector('[name="project_type"]')?.value || "",
                    time: new Date().toLocaleString(),
                    reply_to: form.querySelector('[name="from_email"]').value.trim(),
                    title: "Demande de devis — Portfolio Pro",
                };

                if (!data.from_name || !data.from_email || !data.message) {
                    showToast("Veuillez remplir tous les champs obligatoires", "error");
                    return;
                }

                const res = await emailjs.send(
                    window.emailJsConfig.serviceId,
                    window.emailJsConfig.templateId,
                    data,
                    window.emailJsConfig.publicKey
                );

                if (res.status === 200) {
                    showToast("Demande envoyée ! Je vous réponds sous 24h.");
                    form.reset();
                }
            } catch (err) {
                console.error(err);
                showToast("Erreur. Réessayez ou écrivez-moi directement par email.", "error");
            } finally {
                btn.disabled = false;
                btn.innerHTML = original;
            }
        });
    }

    // ========================
    // Toast
    // ========================
    function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        const span = toast.querySelector("span");
        const icon = toast.querySelector("i");
        span.textContent = message;

        if (type === "error") {
            toast.style.background = "#ef4444";
            icon.className = "fas fa-exclamation-circle";
        } else {
            toast.style.background = "";
            icon.className = "fas fa-check-circle";
        }

        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4000);
    }

    // ========================
    // Smooth scroll
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            const href = this.getAttribute("href");
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // ========================
    // Animated counters
    // ========================
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const counters = entry.target.querySelectorAll("[data-count]");
                counters.forEach((el) => {
                    const target = parseInt(el.dataset.count, 10);
                    const suffix = el.dataset.suffix || "";
                    const duration = 1200;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 4);
                        const current = Math.round(eased * target);
                        el.textContent = current + suffix;
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                });
                counterObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.3 }
    );

    const statsSection = document.querySelector(".about-stats");
    if (statsSection) counterObserver.observe(statsSection);

    // ========================
    // Dark mode toggle
    // ========================
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function getPreferredTheme() {
        const saved = localStorage.getItem("theme");
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        if (themeIcon) {
            themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
        }
    }

    setTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            setTheme(current === "dark" ? "light" : "dark");
        });
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            setTheme(e.matches ? "dark" : "light");
        }
    });
});
