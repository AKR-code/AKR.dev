/**
 * Video Source Management Module
 * Handles video source updates based on theme and viewport aspect ratio
 */

/**
 * Get appropriate video source based on theme and screen orientation
 * @param {boolean} isDark - Whether dark theme is active
 * @returns {string} Video file path
 */
function getVideoSource(isDark) {
    const isPhoneAspect = window.innerWidth < window.innerHeight;

    if (isPhoneAspect) {
        return isDark
            ? 'assets/videos/hero-dark-theme-phone.mp4'
            : 'assets/videos/hero-light-theme-phone.mp4';
    } else {
        return isDark
            ? 'assets/videos/hero-dark-theme.mp4'
            : 'assets/videos/hero-light-theme.mp4';
    }
}

/**
 * Update video source when theme or viewport changes
 * @param {HTMLVideoElement} videoElement - The video element
 * @param {HTMLSourceElement} sourceElement - The source element within the video
 */
function updateVideoSource(videoElement, sourceElement) {
    if (!sourceElement || !videoElement) return;

    const isDark = currentTheme() === 'dark';
    const newSource = getVideoSource(isDark);
    const currentSource = sourceElement.getAttribute('src');

    if (currentSource !== newSource) {
        sourceElement.src = newSource;
        videoElement.load();

        // Use requestAnimationFrame to avoid blocking main thread
        requestAnimationFrame(() => {
            videoElement.play().catch(() => {
                // Autoplay might be blocked, that's okay
            });
        });
    }
}

/**
 * Update video source safely (gets elements from DOM)
 * Useful for theme changes where we need to update video dynamically
 */
function updateVideoSourceSafely() {
    const videoElement = document.getElementById('hero-vid');
    const sourceElement = document.getElementById('video-source');
    updateVideoSource(videoElement, sourceElement);
}
