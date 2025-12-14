/**
 * Theme Management Module
 * Handles dark/light theme switching with localStorage persistence
 */

const THEME_STORAGE_KEY = 'akr-theme';

/**
 * Apply stored theme ASAP to avoid per-page toggling
 */
function applyStoredThemeEarly() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    let isDark;
    if (saved === 'dark' || saved === 'light') {
        isDark = saved === 'dark';
    } else {
        isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
    applyThemeStyles(isDark);
}

/**
 * Apply theme styles to DOM
 * @param {boolean} isDark - Whether to apply dark theme
 */
function applyThemeStyles(isDark) {
    const bgColor = isDark ? '#0f1115' : 'rgb(255, 255, 255)';
    document.documentElement.style.backgroundColor = bgColor;
    document.documentElement.classList.toggle('theme-dark', isDark);
    document.body.classList.toggle('theme-dark', isDark);
}

/**
 * Get current theme
 * @returns {string} 'dark' or 'light'
 */
function currentTheme() {
    return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
}

/**
 * Apply theme and persist to localStorage
 * @param {string} theme - 'dark' or 'light'
 * @param {HTMLElement} themeToggle - Theme toggle checkbox element (optional)
 */
function applyTheme(theme, themeToggle = null) {
    const isDark = theme === 'dark';
    applyThemeStyles(isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');

    // Keep the checkbox in sync if provided
    if (themeToggle) {
        themeToggle.checked = isDark;
    }

    // Update video source when theme changes
    updateVideoSourceOnThemeChange();
}

/**
 * Toggle between dark and light themes
 * @param {HTMLElement} themeToggle - Theme toggle checkbox element (optional)
 */
function toggleTheme(themeToggle = null) {
    const nextTheme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, themeToggle);
}

/**
 * Initialize theme toggle listener
 * @returns {HTMLElement} The theme toggle element, or null if not found
 */
function initThemeToggle() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = saved === 'dark' ? 'dark' : 'light';
    const themeToggle = document.getElementById('theme-toggle');

    if (!themeToggle) return null;

    applyTheme(initialTheme, themeToggle);
    themeToggle.addEventListener('change', () => {
        applyTheme(themeToggle.checked ? 'dark' : 'light', themeToggle);
    }, { passive: true });

    return themeToggle;
}

/**
 * Update video source when theme changes
 * Gets video elements from DOM
 */
function updateVideoSourceOnThemeChange() {
    const videoElement = document.getElementById('hero-vid');
    const sourceElement = document.getElementById('video-source');
    if (videoElement && sourceElement) {
        updateVideoSource(videoElement, sourceElement);
    }
}
