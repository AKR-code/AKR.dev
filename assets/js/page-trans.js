document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // Fade IN on page load
    body.classList.add("fade");
    requestAnimationFrame(() => {
        body.classList.add("show");
    });

    // Fade OUT when navigating
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            // Ignore:
            // 1. empty links
            // 2. #anchor links
            // 3. external links (http, https)
            if (!href || href.startsWith("#") || href.startsWith("http")) return;

            e.preventDefault();
            body.classList.remove("show");

            setTimeout(() => {
                window.location.href = href;
            }, 500); // must match CSS transition time
        });
    });
});
