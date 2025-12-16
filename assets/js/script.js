// Legacy placeholder kept to avoid 404s on older pages.
// All functionality now lives in the modular files listed below.
(function loadModularScripts() {
    const moduleFiles = [
        'assets/js/theme.js',
        'assets/js/partials.js',
        'assets/js/video.js',
        'assets/js/footer.js',
        'assets/js/navigation.js',
        'assets/js/carousel.js',
        'assets/js/main.js',
    ];

    const loaded = new Set(
        Array.from(document.querySelectorAll('script[src]'))
            .map(el => new URL(el.src, window.location.href).pathname.replace(/^\//, ''))
    );

    function loadScript(src) {
        if (loaded.has(src)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const tag = document.createElement('script');
            tag.src = src;
            tag.onload = () => resolve();
            tag.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(tag);
        });
    }

    moduleFiles.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve())
        .catch(err => console.error(err));
})();
