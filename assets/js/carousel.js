/**
 * Carousel Component
 * Manages carousel/slider functionality with auto-play and keyboard support
 */

class Carousel {
    constructor() {
        this.track = document.getElementById('carousel-track');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.prevBtn = document.getElementById('carousel-prev');
        this.nextBtn = document.getElementById('carousel-next');
        this.pagination = document.getElementById('carousel-pagination');

        if (!this.track || this.slides.length === 0) return;

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.resumeTimeout = null;
        this.isUserInteracting = false;

        this.init();
    }

    /**
     * Initialize carousel
     */
    init() {
        this.createPagination();
        this.updateCarousel(false);
        this.attachEventListeners();
        this.initTouchEvents();
        this.startAutoPlay(3000);
    }

    /**
     * Attach click listeners to buttons and keyboard handlers
     */
    attachEventListeners() {
        this.prevBtn?.addEventListener('click', () => {
            this.handleUserInteraction();
            this.prev();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.handleUserInteraction();
            this.next();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.handleUserInteraction();
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.handleUserInteraction();
                this.next();
            }
        });
    }

    /**
     * Create pagination dots
     */
    createPagination() {
        if (!this.pagination) return;

        this.pagination.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === this.currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i, true));
            this.pagination.appendChild(dot);
        }
    }

    /**
     * Update carousel slide positions and pagination
     * @param {boolean} animate - Whether to animate the transition
     */
    updateCarousel(animate = true) {
        if (!animate) {
            this.track.style.transition = 'none';
        } else {
            this.track.style.transition = '';
        }

        // Update slide visibility and positioning
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            const relativeIndex = (index - this.currentIndex + this.totalSlides) % this.totalSlides;

            if (relativeIndex === 0) {
                slide.classList.add('active');
            } else if (relativeIndex === this.totalSlides - 1) {
                slide.classList.add('prev');
                slide.style.setProperty('--slide-offset', -1);
            } else if (relativeIndex === 1) {
                slide.classList.add('next');
                slide.style.setProperty('--slide-offset', 1);
            }
        });

        this.updatePagination();

        // Force reflow if no animation
        if (!animate) {
            void this.track.offsetHeight;
            this.track.style.transition = '';
        }
    }

    /**
     * Update pagination dots to reflect current slide
     */
    updatePagination() {
        if (!this.pagination) return;

        const dots = this.pagination.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    /**
     * Move to next slide
     */
    next() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel(true);

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    /**
     * Move to previous slide
     */
    prev() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel(true);

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     * @param {boolean} isUserAction - Whether this was triggered by user interaction
     */
    goToSlide(index, isUserAction = false) {
        if (this.isTransitioning || index === this.currentIndex) return;
        this.isTransitioning = true;

        if (isUserAction) {
            this.handleUserInteraction();
        }

        this.currentIndex = index;
        this.updateCarousel(true);

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    /**
     * Handle user interaction - pause auto-play and resume after delay
     */
    handleUserInteraction() {
        this.stopAutoPlay();
        if (this.resumeTimeout) clearTimeout(this.resumeTimeout);

        this.isUserInteracting = true;

        this.resumeTimeout = setTimeout(() => {
            this.isUserInteracting = false;
            this.startAutoPlay(3000);
        }, 30000);
    }

    /**
     * Initialize touch/swipe event handling
     */
    initTouchEvents() {
        let startX = 0;
        let endX = 0;
        const SWIPE_THRESHOLD = 50;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', () => {
            const diff = startX - endX;

            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                this.handleUserInteraction();
                if (diff > 0) {
                    this.next(); // Swiped left
                } else {
                    this.prev(); // Swiped right
                }
            }
        });
    }

    /**
     * Start auto-play carousel
     * @param {number} interval - Interval in ms between slides
     */
    startAutoPlay(interval = 3000) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            if (!this.isUserInteracting) {
                this.next();
            }
        }, interval);
    }

    /**
     * Stop auto-play carousel
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

/**
 * Initialize carousel when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('carousel-track')) {
        new Carousel();
    }
});
