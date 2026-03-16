/**
 * cookie-consent.js
 * Gestionnaire de consentement RGPD - Maël Grosa Portfolio
 *
 * Ce script gère le consentement cookies AVANT de charger
 * Microsoft Clarity et Google Tag Manager (gtag).
 *
 * Comportement :
 *  - Clarity & GTM sont bloqués jusqu'à acceptation explicite
 *  - Le choix est stocké en localStorage (clé: mg_cookie_consent)
 *  - Valeur "granted" → trackers activés
 *  - Valeur "denied"  → trackers jamais chargés
 *  - La bannière réapparaît si aucun choix n'a été fait
 */

(function () {
    'use strict';

    // ─── Config ────────────────────────────────────────────────────────────────
    const STORAGE_KEY = 'mg_cookie_consent';
    const GTM_ID = 'G-R45SSMC4CZ';
    const CLARITY_ID = 'vrpnk2eyif';
    const EXPIRY_DAYS = 180; // 6 mois

    // ─── Init GTM en mode "consent denied" par défaut ─────────────────────────
    // Permet à GTM de fonctionner niveau infrastructure sans collecter de données.
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }

    gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500,
    });

    gtag('js', new Date());
    gtag('config', GTM_ID, { send_page_view: false });

    // ─── Helpers ───────────────────────────────────────────────────────────────
    function getConsent() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function saveConsent(value) {
        localStorage.setItem(STORAGE_KEY, value);
        localStorage.setItem(STORAGE_KEY + '_date', Date.now().toString());
    }

    function isExpired() {
        const savedDate = localStorage.getItem(STORAGE_KEY + '_date');
        if (!savedDate) return true;
        const diff = Date.now() - parseInt(savedDate, 10);
        return diff > EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    }

    // ─── Chargement conditionnel des trackers ──────────────────────────────────
    function loadGTM() {
        if (document.getElementById('gtm-script')) return;
        const s = document.createElement('script');
        s.id = 'gtm-script';
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTM_ID;
        document.head.appendChild(s);
        // Mettre à jour le consentement GTM
        gtag('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
        });
        gtag('config', GTM_ID, { send_page_view: true });
    }

    function loadClarity() {
        if (document.getElementById('clarity-script')) return;
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.id = 'clarity-script';
            t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY_ID);
    }

    function activateTrackers() {
        loadGTM();
        loadClarity();
    }

    // ─── Bannière ──────────────────────────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById('mg-cookie-styles')) return;
        const style = document.createElement('style');
        style.id = 'mg-cookie-styles';
        style.textContent = `
      #mg-cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 999999;
        background: rgba(15, 15, 25, 0.97);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255,255,255,0.08);
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        animation: mg-slide-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        box-shadow: 0 -8px 40px rgba(0,0,0,0.4);
      }

      @keyframes mg-slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }

      #mg-cookie-banner.mg-closing {
        animation: mg-slide-down 0.35s cubic-bezier(0.7, 0, 0.84, 0) both;
      }

      @keyframes mg-slide-down {
        from { transform: translateY(0);    opacity: 1; }
        to   { transform: translateY(100%); opacity: 0; }
      }

      #mg-cookie-text {
        flex: 1;
        min-width: 220px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }

      #mg-cookie-icon {
        font-size: 22px;
        flex-shrink: 0;
        margin-top: 2px;
        filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
      }

      #mg-cookie-text p {
        margin: 0;
        font-size: 0.82rem;
        line-height: 1.55;
        color: rgba(255,255,255,0.75);
      }

      #mg-cookie-text strong {
        color: #ffffff;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 3px;
      }

      #mg-cookie-text a {
        color: #818cf8;
        text-decoration: none;
      }

      #mg-cookie-text a:hover {
        text-decoration: underline;
      }

      #mg-cookie-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
        align-items: center;
      }

      .mg-btn {
        padding: 9px 22px;
        border-radius: 50px;
        font-size: 0.84rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        letter-spacing: 0.01em;
        font-family: inherit;
        white-space: nowrap;
      }

      #mg-btn-accept {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        box-shadow: 0 4px 15px rgba(79, 70, 229, 0.45);
      }

      #mg-btn-accept:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
      }

      #mg-btn-deny {
        background: transparent;
        color: rgba(255,255,255,0.55);
        border: 1px solid rgba(255,255,255,0.15);
      }

      #mg-btn-deny:hover {
        color: rgba(255,255,255,0.85);
        border-color: rgba(255,255,255,0.3);
      }

      @media (max-width: 560px) {
        #mg-cookie-banner {
          flex-direction: column;
          align-items: flex-start;
          padding: 16px 20px 20px;
        }
        #mg-cookie-actions {
          width: 100%;
          justify-content: flex-end;
        }
      }
    `;
        document.head.appendChild(style);
    }

    function showBanner() {
        injectStyles();

        const banner = document.createElement('div');
        banner.id = 'mg-cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Gestion des cookies');
        banner.setAttribute('aria-live', 'polite');

        banner.innerHTML = `
      <div id="mg-cookie-text">
        <span id="mg-cookie-icon">🍪</span>
        <div>
          <strong>Ce site utilise des cookies</strong>
          <p>
            Pour améliorer votre expérience et analyser le trafic, nous utilisons
            <strong style="color:#fff">Microsoft Clarity</strong> et
            <strong style="color:#fff">Google Analytics</strong>. Ces outils ne sont activés
            qu'avec votre accord, conformément au RGPD.
            <a href="/mentions-legales.html#cookies" style="color:#818cf8">En savoir plus</a>
          </p>
        </div>
      </div>
      <div id="mg-cookie-actions">
        <button class="mg-btn" id="mg-btn-deny"  aria-label="Refuser les cookies">Refuser</button>
        <button class="mg-btn" id="mg-btn-accept" aria-label="Accepter les cookies">Accepter</button>
      </div>
    `;

        document.body.appendChild(banner);

        document.getElementById('mg-btn-accept').addEventListener('click', function () {
            saveConsent('granted');
            closeBanner(banner);
            activateTrackers();
        });

        document.getElementById('mg-btn-deny').addEventListener('click', function () {
            saveConsent('denied');
            closeBanner(banner);
        });
    }

    function closeBanner(banner) {
        banner.classList.add('mg-closing');
        banner.addEventListener('animationend', function () {
            banner.remove();
        }, { once: true });
    }

    // ─── Entrée principale ─────────────────────────────────────────────────────
    function init() {
        const consent = getConsent();

        // Si le consentement précédent a expiré, on repose la question
        if (consent && isExpired()) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_KEY + '_date');
        }

        const currentConsent = localStorage.getItem(STORAGE_KEY);

        if (currentConsent === 'granted') {
            activateTrackers();
        } else if (currentConsent === 'denied') {
            // Ne rien charger
        } else {
            // Aucun choix → afficher la bannière au chargement du DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showBanner);
            } else {
                showBanner();
            }
        }
    }

    init();

    // Lien "Gérer les cookies" dans le footer
    function bindManageCookiesLink() {
        const link = document.getElementById('manageCookiesLink');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.resetCookieConsent();
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindManageCookiesLink);
    } else {
        bindManageCookiesLink();
    }

    // Expose pour le lien "Gérer les cookies" dans le footer
    window.resetCookieConsent = function () {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY + '_date');
        location.reload();
    };

})();
