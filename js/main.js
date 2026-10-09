/* =============================================================
   LOOM AURA INTERIORS — MAIN.JS
   1. Sticky header shadow on scroll
   2. Mobile navbar toggle
   3. Portfolio filter (All / Living Room / Modular Kitchen / Bedroom / Home Theater)
   4. Auto-updating footer year
============================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------------
       1. STICKY HEADER SHADOW
    ----------------------------------------------------------- */
    const header = document.getElementById("siteHeader");

    const updateHeaderState = () => {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    /* -----------------------------------------------------------
       2. MOBILE NAV TOGGLE
    ----------------------------------------------------------- */
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    const closeNav = () => {
        if (!mainNav || !navToggle) return;
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-is-open");
    };

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");
            navToggle.classList.toggle("is-open", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("nav-is-open", isOpen);
        });

        mainNav.querySelectorAll(".nav-link, .mobile-nav-cta").forEach((link) => {
            link.addEventListener("click", () => {
                closeNav();
                mainNav.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("is-active"));
                link.classList.add("is-active");
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) closeNav();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeNav();
        });
    }

    /* -----------------------------------------------------------
       3. PORTFOLIO FILTER
       - All: shows up to 9 random, balanced images across categories.
       - Category buttons: show every image in that category.
    ----------------------------------------------------------- */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = Array.from(document.querySelectorAll(".portfolio-item"));
    const emptyState = document.getElementById("portfolioEmpty");
    const allImageLimit = 9;

    const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

    const getBalancedRandomItems = () => {
        const byCategory = new Map();

        portfolioItems.forEach((item) => {
            const category = item.dataset.category;
            if (!byCategory.has(category)) byCategory.set(category, []);
            byCategory.get(category).push(item);
        });

        // Randomise each category first, then take one from every category
        // repeatedly. This keeps the selection as even as possible.
        const categoryQueues = Array.from(byCategory.values()).map(shuffle);
        const selected = [];
        let hasMoreImages = true;

        while (selected.length < allImageLimit && hasMoreImages) {
            hasMoreImages = false;

            shuffle(categoryQueues).forEach((queue) => {
                if (selected.length < allImageLimit && queue.length > 0) {
                    selected.push(queue.shift());
                    hasMoreImages = true;
                }
            });
        }

        return new Set(selected);
    };

    const showPortfolioItems = (filter) => {
        const visibleItems = filter === "all"
            ? getBalancedRandomItems()
            : new Set(portfolioItems.filter((item) => item.dataset.category === filter));

        portfolioItems.forEach((item) => {
            item.classList.toggle("is-hidden", !visibleItems.has(item));
        });

        if (emptyState) emptyState.hidden = visibleItems.size !== 0;
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;

            filterButtons.forEach((button) => button.classList.remove("is-active"));
            btn.classList.add("is-active");
            showPortfolioItems(filter);
        });
    });

    // Default view: up to 9 balanced, random portfolio images.
    showPortfolioItems("all");

    /* -----------------------------------------------------------
       4. FOOTER YEAR
    ----------------------------------------------------------- */
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});
