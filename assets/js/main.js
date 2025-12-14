/**
 * Main Application Initialization
 * Coordinates module initialization on page load
 */

/**
 * Initialize all page features on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // 1. Apply stored theme immediately to prevent FOUC (Flash of Unstyled Content)
    applyStoredThemeEarly();

    // 2. Load shared HTML components (nav, footers)
    loadPartials().then(() => {
        // 3. Initialize theme toggle after partials are in DOM
        initThemeToggle();

        // 4. Get hero element and setup footer/video listeners
        const hero = document.getElementById('hero');
        if (hero) {
            const { footerTop, footerBottom, videoSource, video } = computeMetrics(hero);
            setupFooterListeners(hero);
            updateFooterState(footerTop, footerBottom,
                document.querySelector('.status-text'),
                document.querySelector('.status-icons'));
            updateVideoSource(video, videoSource);
        }
    });

    // 5. Fade in page on load
    body.classList.add('fade');
    requestAnimationFrame(() => {
        body.classList.add('show');
    });

    // 6. Setup keyboard navigation
    setupKeyboardNavigation();

    // 7. Setup link click transitions
    setupLinkTransitions();
});
