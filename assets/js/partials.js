/**
 * HTML Partials Loading Module
 * Loads and injects shared HTML components (nav, footers)
 */

/**
 * Fetch a partial HTML file
 * @param {string} path - Path to the partial file
 * @returns {Promise<string>} HTML content
 */
async function fetchPartial(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load partial: ${path}`);
    return res.text();
}

/**
 * Get fallback markup for nav and footers
 * Used when fetch is blocked (file:// protocol)
 */
const FALLBACK_MARKUP = {
    nav: `<nav id="ribbon">
        <a href="index.html" class="button">Home</a>
        <div class="spacer"></div>
        <a href="projects.html" class="button">Projects</a>
        <a href="library.html" class="button">Library</a>
        <a href="events.html" class="button">Events</a>
    </nav>`,

    footerTop: `<div id="footer-top" class="footer-top">
        <label class="toggle" for="theme-toggle">
            <input type="checkbox" id="theme-toggle" aria-label="Toggle dark mode">
            Darkmode
        </label>
        <div id="footer-status" class="footer-status">
            <span class="status-text">Scroll down to explore!!</span>
            <div class="status-icons" style="display: none;">
                <span class="status-icons-label">Follow me in </span>
                <a class="footer-icon" href="https://www.researchgate.net/profile/Koushik-Allam?ev=hdr_xprf" target="_blank" rel="noreferrer">
                    <img src="assets/images/footer-researchgate.jpg" alt="ResearchGate">
                </a>
                <a class="footer-icon" href="https://github.com/AKR-code" target="_blank" rel="noreferrer">
                    <img src="assets/images/footer-github.jpg" alt="GitHub">
                </a>
                <a class="footer-icon" href="https://www.linkedin.com/in/koushik-reddy-allam-aa36a6388/" target="_blank" rel="noreferrer">
                    <img src="assets/images/footer-linkedin.jpeg" alt="LinkedIn">
                </a>
            </div>
        </div>
    </div>`,

    footerBottom: `<footer id="footer-bottom" class="footer-bottom">
        <div class="footer-photo">
            <img src="assets/images/PHOTO.jpeg" alt="Allam Koushik Reddy">
        </div>
        <div class="footer-address">
            <div class="footer-title">Koushik</div>
            <div></div>
        </div>
    </footer>`
};

/**
 * Insert markup if not already present
 * @param {string} html - HTML content
 * @param {string} id - Element ID to check for
 * @param {string} position - 'afterbegin', 'beforeend', or 'afterend'
 * @param {HTMLElement} referenceEl - Reference element for 'afterend'
 */
function insertMarkupIfNotExists(html, id, position, referenceEl = null) {
    if (document.getElementById(id)) return;

    if (position === 'afterend' && referenceEl) {
        referenceEl.insertAdjacentHTML(position, html);
    } else {
        document.body.insertAdjacentHTML(position, html);
    }
}

/**
 * Inject fallback markup (used when fetch fails or file:// protocol)
 */
function injectFallbackMarkup() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.outerHTML = FALLBACK_MARKUP.nav;
    } else {
        insertMarkupIfNotExists(FALLBACK_MARKUP.nav, 'ribbon', 'afterbegin');
    }

    insertMarkupIfNotExists(FALLBACK_MARKUP.footerTop, 'footer-top', 'beforeend');

    const main = document.querySelector('main');
    insertMarkupIfNotExists(FALLBACK_MARKUP.footerBottom, 'footer-bottom', 'afterend', main);
}

/**
 * Load and inject HTML partials (nav, footers)
 * Falls back to inline markup if fetch fails
 */
async function loadPartials() {
    // Immediately inject fallback for instant render, then replace with fetched if available
    injectFallbackMarkup();

    try {
        // Skip fetch on file:// protocol
        if (window.location.protocol === 'file:') {
            return;
        }

        // Load navigation
        const navHtml = await fetchPartial('assets/html/nav.html');
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) {
            navPlaceholder.outerHTML = navHtml;
        } else if (!document.getElementById('ribbon')) {
            document.body.insertAdjacentHTML('afterbegin', navHtml);
        }

        // Load footer-top
        insertMarkupIfNotExists(
            await fetchPartial('assets/html/footer-top.html'),
            'footer-top',
            'beforeend'
        );

        // Load footer-bottom
        const footerBottomHtml = await fetchPartial('assets/html/footer-bottom.html');
        const main = document.querySelector('main');
        if (!document.getElementById('footer-bottom')) {
            if (main) {
                main.insertAdjacentHTML('afterend', footerBottomHtml);
            } else {
                document.body.insertAdjacentHTML('beforeend', footerBottomHtml);
            }
        }
    } catch (e) {
        console.warn('Failed to load partials:', e);
        injectFallbackMarkup();
    }
}
