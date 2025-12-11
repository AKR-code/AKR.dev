const THEME_STORAGE_KEY = 'akr-theme';

// Apply stored theme ASAP to avoid per-page toggling
function applyStoredThemeEarly() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const isDark = saved === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
}

// Apply stored theme immediately on script load
applyStoredThemeEarly();

// Reusable navigation ribbon component (top + bottom)
function loadNavigation() {
    const nav = `
        <nav id="ribbon">
            <a href="index.html" class="button">Home</a>
            <div class="spacer"></div>
            <a href="projects.html" class="button">Projects</a>
            <a href="library.html" class="button">Library</a>
            <a href="events.html" class="button">Events</a>
            <a href="assets/pdfs/cv.pdf" class="button" target="_blank">CV</a>
        </nav>
    `;

    const footerTop = `
        <div id="footer-top" class="footer-top">
            <label class="toggle" for="theme-toggle">
                <input type="checkbox" id="theme-toggle" aria-label="Toggle dark mode">
                Darkmode
            </label>
            <div id="footer-status" class="footer-status">
                <span class="status-text">Scroll down to explore!!</span>
                <div class="status-icons" style="display: none;">
                    <a class="footer-icon" href="https://www.researchgate.net/profile/Koushik-Allam?ev=hdr_xprf" target="_blank" rel="noreferrer">
                        <img src="assets/images/footer-researchgate.png" alt="ResearchGate">
                    </a>
                    <a class="footer-icon" href="https://github.com/AKR-code" target="_blank" rel="noreferrer">
                        <img src="assets/images/footer-github.png" alt="GitHub">
                    </a>
                    <a class="footer-icon" href="https://www.linkedin.com/in/koushik-reddy-allam-aa36a6388/" target="_blank" rel="noreferrer">
                        <img src="assets/images/footer-linkedin.png" alt="LinkedIn">
                    </a>
                </div>
            </div>
        </div>
    `;

    const footerBottom = `
        <footer id="footer-bottom" class="footer-bottom">
            <div class="footer-photo">
                <img src="assets/images/PHOTO.jpeg" alt="Allam Koushik Reddy">
            </div>
            <div class="footer-address">
                <div class="footer-title">Koushik</div>
                <div>
                    25mcce10@uohyd.ac.in,<br>
                    koushik.r.allam@gmail.com.
                </div>
            </div>
        </footer>
    `;

    // Replace placeholder with navigation
    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.outerHTML = nav;
    }

    // Ensure top nav exists on pages without placeholder
    if (!document.getElementById('ribbon')) {
        document.body.insertAdjacentHTML('afterbegin', nav);
    }

    // Add footer-top (fixed at bottom) once per page
    if (!document.getElementById('footer-top')) {
        document.body.insertAdjacentHTML('beforeend', footerTop);
    }

    // Add footer-bottom (normal document flow) after main content
    if (!document.getElementById('footer-bottom')) {
        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('afterend', footerBottom);
        } else {
            document.body.insertAdjacentHTML('beforeend', footerBottom);
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

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.checked = initialTheme === 'dark';
    toggle.addEventListener('change', () => {
        const nextTheme = toggle.checked ? 'dark' : 'light';
        applyTheme(nextTheme);
    });
}

function updateVideoSource() {
    const videoSource = document.getElementById('video-source');
    const video = document.getElementById('hero-vid');
    if (!videoSource || !video) return;

    const isDark = currentTheme() === 'dark';
    const isPhoneAspect = window.innerWidth < window.innerHeight;

    let newSource;
    if (isPhoneAspect) {
        newSource = isDark
            ? 'assets/videos/hero-dark-theme-vid-phone.mp4'
            : 'assets/videos/hero-light-theme-vid-phone.mp4';
    } else {
        newSource = isDark
            ? 'assets/videos/hero-dark-theme-vid.mp4'
            : 'assets/videos/hero-light-theme-vid.mp4';
    }

    if (videoSource.getAttribute('src') !== newSource) {
        videoSource.src = newSource;
        video.pause();
        video.currentTime = 0;
        video.load();
        video.play().catch(() => {
            // Autoplay might be blocked, that's okay
        });
    }
}

function updateFooterState() {
    const footerTop = document.getElementById('footer-top');
    const footerBottom = document.getElementById('footer-bottom');
    const hero = document.getElementById('hero');
    const statusText = document.querySelector('.status-text');
    const statusIcons = document.querySelector('.status-icons');
    if (!footerTop || !footerBottom || !statusText || !statusIcons) return;

    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;
    const heroHeight = hero ? hero.offsetHeight : 0;

    // Get footer-bottom's position in the document
    const footerBottomOffsetTop = footerBottom.offsetTop;
    const footerTopHeight = footerTop.offsetHeight;

    // The point where footer-top should start moving (when footer-bottom reaches near viewport bottom)
    const transitionPoint = footerBottomOffsetTop - viewportH + footerTopHeight;

    if (scrollY > transitionPoint) {
        // User has scrolled past the transition point, switch to absolute positioning
        footerTop.style.position = 'absolute';
        footerTop.style.bottom = 'auto';
        footerTop.style.left = '0';
        footerTop.style.right = '0';
        // Position footer-top right on top of footer-bottom
        footerTop.style.top = (footerBottomOffsetTop - footerTopHeight) + 'px';
    } else {
        // Keep footer-top fixed at bottom of viewport
        footerTop.style.position = 'fixed';
        footerTop.style.bottom = '0';
        footerTop.style.left = '0';
        footerTop.style.right = '0';
        footerTop.style.top = 'auto';
    }

    // Status text/icons: show hint when in hero, show icons when past hero
    const isPastHero = scrollY > heroHeight * 0.5;
    if (isPastHero) {
        statusText.style.display = 'none';
        statusIcons.style.display = 'flex';
    } else {
        statusText.style.display = 'inline';
        statusIcons.style.display = 'none';
    }
}

// Reflow hero content on resize to ensure proper alignment
function handleHeroResize() {
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
        // Force layout recalculation by triggering a reflow
        void heroContent.offsetHeight;
    }
}

// Listen for resize events to update hero layout and video
let resizeTimeout;
window.addEventListener('resize', () => {
    handleHeroResize();
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateVideoSource, 250);
});

// Footer visibility / expansion on scroll
window.addEventListener('scroll', updateFooterState);

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // Apply stored theme immediately on load to keep it consistent across pages
    applyStoredThemeEarly();

    // Load navigation component
    loadNavigation();

    // Initialize theme toggle and set initial theme
    initThemeToggle();

    // Sync footer state on load
    updateFooterState();

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
            }, 500); // must match CSS transition time
        });
    });
});
