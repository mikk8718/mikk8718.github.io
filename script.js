const words = [
  "coder",
  "enthusiast",
  "foodie",
  "football fan",
  "techie",
  "maker",
  "dreamer",
  "designer",
  "explorer",
  "nerd"
];


const typingDelay = 100;
const erasingDelay = 50;
const newWordDelay = 1500;
let wordIndex = 0;
let charIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    const typedTextSpan = document.querySelector(".typed-text");

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
});