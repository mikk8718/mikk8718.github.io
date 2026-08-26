document.addEventListener("DOMContentLoaded", () => {
    const typewriterGroup = document.querySelector(".typewriter-group");
    const typewriterItems = document.querySelectorAll("[data-typewriter-item]");
    const lifeSection = document.querySelector(".life-section");
    const sectionMarkers = document.querySelectorAll("[data-section-marker]");
    const railSections = document.querySelectorAll("[data-rail-section]");

    const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    async function typeNode(sourceNode, targetParent, delay) {
        if (sourceNode.nodeType === Node.TEXT_NODE) {
            let text = sourceNode.textContent.replace(/\s+/g, " ");

            if (!text.trim()) return;
            if (!targetParent.textContent) text = text.trimStart();

            for (const character of text) {
                targetParent.append(character);
                await wait(character === " " ? delay * 0.45 : delay);
            }
            return;
        }

        if (sourceNode.nodeType !== Node.ELEMENT_NODE) return;

        const clone = sourceNode.cloneNode(false);
        targetParent.append(clone);

        for (const childNode of sourceNode.childNodes) {
            await typeNode(childNode, clone, delay);
        }
    }

    async function runHeroTypewriter() {
        if (!typewriterItems.length) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const compactViewport = window.matchMedia("(max-width: 520px)").matches;

        if (prefersReducedMotion || compactViewport) {
            typewriterItems.forEach((item) => item.classList.add("is-typed"));
            document.documentElement.classList.add("hero-typewriter-complete");
            return;
        }

        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        if (typewriterGroup) {
            typewriterGroup.style.minHeight = `${Math.ceil(typewriterGroup.getBoundingClientRect().height)}px`;
        }

        const itemSnapshots = Array.from(typewriterItems, (item) => ({
            item,
            children: Array.from(item.childNodes, (childNode) => childNode.cloneNode(true))
        }));

        typewriterItems.forEach((item) => {
            item.replaceChildren();
            item.classList.add("typewriter-ready");
        });

        await wait(450);

        for (const { item, children } of itemSnapshots) {
            item.classList.add("is-typing");

            for (const childNode of children) {
                await typeNode(childNode, item, 42);
            }

            item.classList.remove("is-typing");
            item.classList.add("is-typed");
            await wait(340);
        }

        document.documentElement.classList.add("hero-typewriter-complete");
    }

    runHeroTypewriter();

    if (sectionMarkers.length && railSections.length) {
        let railTicking = false;

        function setActiveRailMarker() {
            const checkpoint = window.scrollY + window.innerHeight * 0.48;
            const pageEnd = document.documentElement.scrollHeight - window.innerHeight - 140;
            const isNearPageEnd = window.scrollY >= pageEnd;
            let activeId = railSections[0].id;

            railSections.forEach((section) => {
                if (section.offsetTop <= checkpoint) {
                    activeId = section.id;
                }
            });

            if (isNearPageEnd) {
                activeId = railSections[railSections.length - 1].id;
            }

            sectionMarkers.forEach((marker) => {
                const isActive = marker.dataset.sectionMarker === activeId;
                marker.classList.toggle("is-active", isActive);
                if (isActive) {
                    marker.setAttribute("aria-current", "true");
                } else {
                    marker.removeAttribute("aria-current");
                }
            });

            railTicking = false;
        }

        function queueRailUpdate() {
            if (railTicking) return;
            railTicking = true;
            window.requestAnimationFrame(setActiveRailMarker);
        }

        setActiveRailMarker();
        window.addEventListener("scroll", queueRailUpdate, { passive: true });
        window.addEventListener("resize", queueRailUpdate);
    }

    if (!lifeSection) return;

    if (!("IntersectionObserver" in window)) {
        lifeSection.classList.add("life-in-view");
        return;
    }

    const lifeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            lifeSection.classList.toggle("life-in-view", entry.isIntersecting);
        });
    }, {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.28
    });

    lifeObserver.observe(lifeSection);
});
