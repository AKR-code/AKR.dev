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
        }

        // Load and crossfade video after all content is ready
        const loadVideo = () => {
            const videoEl = document.getElementById('hero-vid');
            const sourceEl = document.getElementById('video-source');
            if (!videoEl || !sourceEl) return;

            const isDark = window.__initialTheme === 'dark';
            const isPhone = window.innerWidth < window.innerHeight;
            const src = isDark
                ? (isPhone ? 'assets/videos/hero-dark-theme-phone.mp4' : 'assets/videos/hero-dark-theme.mp4')
                : (isPhone ? 'assets/videos/hero-light-theme-phone.mp4' : 'assets/videos/hero-light-theme.mp4');

            sourceEl.src = src;
            videoEl.load();

            // Wait for video to actually be playing before crossfade
            videoEl.addEventListener('playing', function onPlaying() {
                videoEl.classList.add('loaded');
                // Remove background image from hero after video fades in
                setTimeout(() => {
                    const hero = document.getElementById('hero');
                    if (hero) hero.style.backgroundImage = 'none';
                }, 800);
            }, { once: true });

            // Start playing as soon as we can
            videoEl.addEventListener('canplaythrough', function onCanPlay() {
                videoEl.play().catch(() => {
                    // If autoplay fails, still show the video
                    videoEl.classList.add('loaded');
                });
            }, { once: true });
        };

        // Start loading video after a short delay
        setTimeout(loadVideo, 500);
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
