const words = [
  "coder",
  "enthusiast",
  "foodie",
  "football fan",
  "techie",
  "designer",
  "nerd",
  "red devil"
];


const typingDelay = 100;
const erasingDelay = 50;
const newWordDelay = 1500;
let wordIndex = 0;
let charIndex = 0;

const workContent = {
    build: {
        tags: ["Systems", "APIs", "Frontend"],
        primary: "My background combines <strong>software development</strong>, Medialogy, UX understanding, and communication. I have worked with backend systems, APIs, databases, frontend implementation, QA, and collaboration with stakeholders.",
        secondary: "The common thread is simple: I like turning <em>complex requirements</em> into usable products that people can understand, trust, and maintain."
    },
    shape: {
        tags: ["Architecture", "Reuse", "Documentation"],
        primary: "I care about the shape of a solution: clear boundaries, reusable patterns, and code that still makes sense when someone returns to it later.",
        secondary: "For me, quality is practical. It means fewer surprises, better handoffs, and enough documentation that the next person can move with confidence."
    },
    share: {
        tags: ["Stakeholders", "Agile", "Communication"],
        primary: "I like working close to people: developers, designers, stakeholders, and clients. Good software usually starts with good conversations.",
        secondary: "I try to make collaboration feel simple by asking clear questions, sharing context early, and keeping momentum without making the process heavy."
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const typedTextSpan = document.querySelector(".typed-text");
    const lifeSection = document.querySelector(".life-section");
    const workButtons = document.querySelectorAll("[data-work-key]");
    const workTags = document.querySelector(".work-tags");
    const workCopyPrimary = document.querySelector("#work-copy-primary");
    const workCopySecondary = document.querySelector("#work-copy-secondary");

    function type() {
        if (charIndex < words[wordIndex].length) {
            typedTextSpan.textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = words[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, typingDelay);
        }
    }

    if (typedTextSpan) setTimeout(type, newWordDelay);

    function renderWorkContent(key) {
        const content = workContent[key];
        if (!content || !workTags || !workCopyPrimary || !workCopySecondary) return;
        const workCopy = workTags.closest(".profile-copy");

        workTags.innerHTML = content.tags.map((tag) => `<span>${tag}</span>`).join("");
        workCopyPrimary.innerHTML = content.primary;
        workCopySecondary.innerHTML = content.secondary;

        workButtons.forEach((button) => {
            const isActive = button.dataset.workKey === key;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        if (workCopy) {
            workCopy.classList.remove("is-rendering");
            void workCopy.offsetWidth;
            workCopy.classList.add("is-rendering");
        }
    }

    workButtons.forEach((button) => {
        button.addEventListener("click", () => renderWorkContent(button.dataset.workKey));
    });

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
