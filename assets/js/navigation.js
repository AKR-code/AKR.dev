/**
 * Keyboard Navigation Module
 * Handles keyboard shortcuts for page navigation and scrolling
 */

const PAGE_ORDER = ['index.html', 'projects.html', 'library.html', 'events.html'];
const PAGE_TRANSITION_TIME = 220; // Must match CSS transition time in ms

/**
 * Get the current page from URL
 * @returns {string} Current page filename
 */
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

/**
 * Get index of current page in page order
 * @returns {number} Page index or -1 if not found
 */
function getCurrentPageIndex() {
    return PAGE_ORDER.indexOf(getCurrentPage());
}

/**
 * Perform page transition with fade effect
 * @param {string} targetPage - Filename of target page
 */
function navigateToPage(targetPage) {
    const currentPage = getCurrentPage();
    if (currentPage === targetPage) return;

    const body = document.body;
    body.classList.remove('show');

    setTimeout(() => {
        window.location.href = targetPage;
    }, PAGE_TRANSITION_TIME);
}

/**
 * Navigate to page by index
 * @param {number} pageIndex - Index in PAGE_ORDER array
 */
function goToPageIndex(pageIndex) {
    if (pageIndex < 0 || pageIndex >= PAGE_ORDER.length) return;
    navigateToPage(PAGE_ORDER[pageIndex]);
}

/**
 * Setup keyboard event listeners for navigation and shortcuts
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Ctrl + D toggles theme
        if (e.ctrlKey && !e.altKey && !e.metaKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            const themeToggle = document.getElementById('theme-toggle');
            toggleTheme(themeToggle);
            return;
        }

        // Page navigation (left/prev)
        if (e.key === 'a' || e.key === 'h' || e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPageIndex(getCurrentPageIndex() - 1);
        }
        // Page navigation (right/next)
        else if (e.key === 'd' || e.key === 'l' || e.key === 'ArrowRight') {
            e.preventDefault();
            goToPageIndex(getCurrentPageIndex() + 1);
        }
        // Scroll up
        else if (e.key === 'w' || e.key === 'k' || e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollBy({
                top: -100,
                behavior: 'smooth'
            });
        }
        // Scroll down
        else if (e.key === 's' || e.key === 'j' || e.key === 'ArrowDown') {
            e.preventDefault();
            window.scrollBy({
                top: 100,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Setup link click handlers for page transitions
 */
function setupLinkTransitions() {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');

            // Skip:
            // - empty links
            // - anchor links (#)
            // - external links (http, https)
            // - links opening in new tab
            if (!href || href.startsWith('#') || href.startsWith('http') || target === '_blank') {
                return;
            }

            e.preventDefault();
            navigateToPage(href);
        });
    });
}
