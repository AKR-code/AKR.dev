/**
 * Footer Positioning Module
 * Manages footer state based on scroll position and viewport metrics
 */

const footerMetrics = {
    heroHeight: 0,
    footerTopHeight: 0,
    footerBottomOffsetTop: 0,
    viewportH: 0,
};

const footerRefs = {
    footerTop: null,
    footerBottom: null,
    statusText: null,
    statusIcons: null,
    videoSource: null,
    video: null,
};

let rafPending = false;

/**
 * Update footer positioning based on scroll position
 * @param {HTMLElement} footerTop - Footer top element
 * @param {HTMLElement} footerBottom - Footer bottom element
 * @param {HTMLElement} statusText - Status text element
 * @param {HTMLElement} statusIcons - Status icons container
 */
function updateFooterState(footerTop, footerBottom, statusText, statusIcons) {
    if (!footerTop || !footerBottom || !statusText || !statusIcons) return;

    const scrollY = window.scrollY;
    const transitionPoint = footerMetrics.footerBottomOffsetTop - footerMetrics.viewportH;
    const isPastHero = scrollY > footerMetrics.heroHeight * 0.5;

    // Update footer-top positioning
    if (scrollY > transitionPoint) {
        footerTop.style.position = 'absolute';
        footerTop.style.bottom = 'auto';
        footerTop.style.left = '0';
        footerTop.style.right = '0';
        footerTop.style.top = (footerMetrics.footerBottomOffsetTop - footerMetrics.footerTopHeight) + 'px';
    } else {
        footerTop.style.position = 'fixed';
        footerTop.style.bottom = '0';
        footerTop.style.left = '0';
        footerTop.style.right = '0';
        footerTop.style.top = 'auto';
    }

    // Toggle status UI visibility
    statusText.style.display = isPastHero ? 'none' : 'inline';
    statusIcons.style.display = isPastHero ? 'flex' : 'none';
}

/**
 * Compute and cache layout metrics
 * @param {HTMLElement} hero - Hero section element
 * @returns {Object} Object containing cached element references
 */
function cacheFooterRefs() {
    footerRefs.footerTop = document.getElementById('footer-top');
    footerRefs.footerBottom = document.getElementById('footer-bottom');
    footerRefs.statusText = document.querySelector('.status-text');
    footerRefs.statusIcons = document.querySelector('.status-icons');
    footerRefs.videoSource = document.getElementById('video-source');
    footerRefs.video = document.getElementById('hero-vid');
    return footerRefs;
}

function computeMetrics(hero, refs = cacheFooterRefs()) {
    footerMetrics.viewportH = window.innerHeight;
    footerMetrics.heroHeight = hero?.offsetHeight ?? 0;
    footerMetrics.footerBottomOffsetTop = refs.footerBottom?.offsetTop ?? 0;
    footerMetrics.footerTopHeight = refs.footerTop?.offsetHeight ?? 0;

    return refs;
}

/**
 * Trigger reflow of hero content on resize
 */
function handleHeroResize() {
    const heroContent = document.getElementById('hero-content');
    if (heroContent) void heroContent.offsetHeight; // Force reflow
}

/**
 * Setup footer and hero resize/scroll listeners
 * @param {HTMLElement} hero - Hero section element
 */
function setupFooterListeners(hero, refs = computeMetrics(hero)) {
    if (!hero) return;

    // Handle resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        handleHeroResize();
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            computeMetrics(hero, refs);
            updateFooterState(refs.footerTop, refs.footerBottom, refs.statusText, refs.statusIcons);
            updateVideoSource(refs.video, refs.videoSource);
        }, 200);
    }, { passive: true });

    // Handle scroll with RAF throttling and cached metrics
    window.addEventListener('scroll', () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            updateFooterState(refs.footerTop, refs.footerBottom, refs.statusText, refs.statusIcons);
            rafPending = false;
        });
    }, { passive: true });
}
