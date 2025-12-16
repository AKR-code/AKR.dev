/**
 * Main Application Initialization
 * Coordinates module initialization on page load
 */

let appInitialized = false;

function initApp() {
    if (appInitialized) return;
    appInitialized = true;

    const body = document.body;

    // Apply stored theme immediately to prevent FOUC (Flash of Unstyled Content)
    applyStoredThemeEarly();

    // Load shared HTML components (nav, footers)
    loadPartials().then(() => {
        // Initialize theme toggle after partials are in DOM
        initThemeToggle();

        // Setup footer/video listeners when hero exists
        const hero = document.getElementById('hero');
        if (hero) {
            const refs = computeMetrics(hero);
            setupFooterListeners(hero, refs);
            updateFooterState(refs.footerTop, refs.footerBottom, refs.statusText, refs.statusIcons);
            // Skip initial video update - inline script already set correct source
        }
    });

    // Fade in page on load
    body.classList.add('fade');
    requestAnimationFrame(() => {
        body.classList.add('show');
    });

    // Setup keyboard navigation and link transitions
    setupKeyboardNavigation();
    setupLinkTransitions();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
