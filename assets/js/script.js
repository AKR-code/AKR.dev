const THEME_STORAGE_KEY = 'akr-theme';
let els = {
    videoSource: null,
    video: null,
    hero: null,
    footerTop: null,
    footerBottom: null,
    statusText: null,
    statusIcons: null,
    themeToggle: null,
};

// Apply stored theme ASAP to avoid per-page toggling
function applyStoredThemeEarly() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    let isDark;
    if (saved === 'dark' || saved === 'light') {
        isDark = saved === 'dark';
    } else {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    document.body.classList.toggle('theme-dark', isDark);
}

// Apply stored theme immediately on script load
applyStoredThemeEarly();

// Load partial HTML files and inject into the DOM uniformly
async function fetchPartial(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load partial: ${path}`);
    return res.text();
}

async function loadPartials() {
    try {
        // If running from filesystem, many browsers block fetch; use fallback
        const isFileProtocol = window.location.protocol === 'file:';
        if (isFileProtocol) {
            injectFallbackMarkup();
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
        if (!document.getElementById('footer-top')) {
            const footerTopHtml = await fetchPartial('assets/html/footer-top.html');
            document.body.insertAdjacentHTML('beforeend', footerTopHtml);
        }

        // Load footer-bottom after main
        if (!document.getElementById('footer-bottom')) {
            const footerBottomHtml = await fetchPartial('assets/html/footer-bottom.html');
            const main = document.querySelector('main');
            if (main) {
                main.insertAdjacentHTML('afterend', footerBottomHtml);
            } else {
                document.body.insertAdjacentHTML('beforeend', footerBottomHtml);
            }
        }
    } catch (e) {
        // If any partial fails, fall back to inline markup so UI is visible
        console.warn(e);
        injectFallbackMarkup();
    }
}

function injectFallbackMarkup() {
    const navHtml = '<nav id="ribbon">\n        <a href="index.html" class="button">Home</a>\n        <div class="spacer"></div>\n        <a href="projects.html" class="button">Projects</a>\n        <a href="library.html" class="button">Library</a>\n        <a href="events.html" class="button">Events</a>\n        <!-- <a href="assets/pdfs/cv.pdf" class="button" target="_blank">CV</a> -->\n    </nav>';
    const footerTopHtml = '<div id="footer-top" class="footer-top">\n        <label class="toggle" for="theme-toggle">\n            <input type="checkbox" id="theme-toggle" aria-label="Toggle dark mode">\n            Darkmode\n        </label>\n        <div id="footer-status" class="footer-status">\n            <span class="status-text">Scroll down to explore!!</span>\n            <div class="status-icons" style="display: none;">\n                <a class="footer-icon" href="https://www.researchgate.net/profile/Koushik-Allam?ev=hdr_xprf" target="_blank" rel="noreferrer">\n                    <img src="assets/images/footer-researchgate.jpg" alt="ResearchGate">\n                </a>\n                <a class="footer-icon" href="https://github.com/AKR-code" target="_blank" rel="noreferrer">\n                    <img src="assets/images/footer-github.jpg" alt="GitHub">\n                </a>\n                <a class="footer-icon" href="https://www.linkedin.com/in/koushik-reddy-allam-aa36a6388/" target="_blank" rel="noreferrer">\n                    <img src="assets/images/footer-linkedin.jpeg" alt="LinkedIn">\n                </a>\n            </div>\n        </div>\n    </div>';
    const footerBottomHtml = '<footer id="footer-bottom" class="footer-bottom">\n        <div class="footer-photo">\n            <img src="assets/images/PHOTO.jpeg" alt="Allam Koushik Reddy">\n        </div>\n        <div class="footer-address">\n            <div class="footer-title">Koushik</div>\n            <div>\n            </div>\n        </div>\n    </footer>';

    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.outerHTML = navHtml;
    } else if (!document.getElementById('ribbon')) {
        document.body.insertAdjacentHTML('afterbegin', navHtml);
    }

    if (!document.getElementById('footer-top')) {
        document.body.insertAdjacentHTML('beforeend', footerTopHtml);
    }

    if (!document.getElementById('footer-bottom')) {
        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('afterend', footerBottomHtml);
        } else {
            document.body.insertAdjacentHTML('beforeend', footerBottomHtml);
        }
    }
}

function currentTheme() {
    return document.body.classList.contains('theme-dark') ? 'dark' : 'light';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    updateVideoSource();
}

function initThemeToggle() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = saved === 'dark' ? 'dark' : 'light';
    applyTheme(initialTheme);

    els.themeToggle = document.getElementById('theme-toggle');
    if (!els.themeToggle) return;

    els.themeToggle.checked = initialTheme === 'dark';
    els.themeToggle.addEventListener('change', () => {
        applyTheme(els.themeToggle.checked ? 'dark' : 'light');
    }, { passive: true });
}

function updateVideoSource() {
    // Only on pages with hero video
    if (!els.videoSource || !els.video) return;

    const isDark = currentTheme() === 'dark';
    const isPhoneAspect = window.innerWidth < window.innerHeight;

    let newSource;
    if (isPhoneAspect) {
        newSource = isDark
            ? 'assets/videos/hero-dark-theme-phone.mp4'
            : 'assets/videos/hero-light-theme-phone.mp4';
    } else {
        newSource = isDark
            ? 'assets/videos/hero-dark-theme.mp4'
            : 'assets/videos/hero-light-theme.mp4';
    }

    const currentSource = els.videoSource.getAttribute('src');
    if (currentSource !== newSource) {
        els.videoSource.src = newSource;
        els.video.load();
        // Use requestAnimationFrame to avoid blocking main thread
        requestAnimationFrame(() => {
            els.video.play().catch(() => {
                // Autoplay might be blocked, that's okay
            });
        });
    }
}

let rafPending = false;
let metrics = {
    heroHeight: 0,
    footerTopHeight: 0,
    footerBottomOffsetTop: 0,
    viewportH: 0,
};

function updateFooterState() {
    if (!els.footerTop || !els.footerBottom || !els.statusText || !els.statusIcons) return;

    const scrollY = window.scrollY;
    const transitionPoint = metrics.footerBottomOffsetTop - metrics.viewportH + metrics.footerTopHeight;
    const isPastHero = scrollY > metrics.heroHeight * 0.5;

    // Positioning writes
    if (scrollY > transitionPoint) {
        els.footerTop.style.position = 'absolute';
        els.footerTop.style.bottom = 'auto';
        els.footerTop.style.left = '0';
        els.footerTop.style.right = '0';
        els.footerTop.style.top = (metrics.footerBottomOffsetTop - metrics.footerTopHeight) + 'px';
    } else {
        els.footerTop.style.position = 'fixed';
        els.footerTop.style.bottom = '0';
        els.footerTop.style.left = '0';
        els.footerTop.style.right = '0';
        els.footerTop.style.top = 'auto';
    }

    // Toggle status UI
    els.statusText.style.display = isPastHero ? 'none' : 'inline';
    els.statusIcons.style.display = isPastHero ? 'flex' : 'none';
}

// Reflow hero content on resize to ensure proper alignment
function handleHeroResize() {
    const heroContent = document.getElementById('hero-content');
    if (heroContent) void heroContent.offsetHeight;
}

function computeMetrics() {
    els.hero = document.getElementById('hero');
    els.footerTop = document.getElementById('footer-top');
    els.footerBottom = document.getElementById('footer-bottom');
    els.statusText = document.querySelector('.status-text');
    els.statusIcons = document.querySelector('.status-icons');
    els.videoSource = document.getElementById('video-source');
    els.video = document.getElementById('hero-vid');

    metrics.viewportH = window.innerHeight;
    metrics.heroHeight = els.hero ? els.hero.offsetHeight : 0;
    metrics.footerBottomOffsetTop = els.footerBottom ? els.footerBottom.offsetTop : 0;
    metrics.footerTopHeight = els.footerTop ? els.footerTop.offsetHeight : 0;
}

// Listen for resize events to update hero layout and video
let resizeTimeout;
window.addEventListener('resize', () => {
    handleHeroResize();
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        computeMetrics();
        updateVideoSource();
        updateFooterState();
    }, 200);
}, { passive: true });

// Footer visibility / expansion on scroll with requestAnimationFrame throttling
window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
        updateFooterState();
        rafPending = false;
    });
}, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // Apply stored theme immediately on load to keep it consistent across pages
    applyStoredThemeEarly();

    // Load shared partials (nav + footers)
    loadPartials().then(() => {
        // Initialize theme toggle after partials are in DOM
        initThemeToggle();
        // Cache references & metrics once elements exist
        computeMetrics();
        // Sync footer state and video source on load
        updateFooterState();
        updateVideoSource();
    });


    // Fade IN on page load
    body.classList.add("fade");
    requestAnimationFrame(() => {
        body.classList.add("show");
    });

    // Fade OUT when navigating
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            const target = this.getAttribute("target");

            // Ignore:
            // 1. empty links
            // 2. #anchor links
            // 3. external links (http, https)
            // 4. links meant to open in a new tab/window
            if (!href || href.startsWith("#") || href.startsWith("http") || target === "_blank") return;

            e.preventDefault();
            body.classList.remove("show");

            setTimeout(() => {
                window.location.href = href;
            }, 170); // must match CSS transition time
        });
    });
});
