const { readFileSync } = require("node:fs");
const test = require("node:test");
const assert = require("node:assert/strict");

test("progressive content and section navigation stay wired", () => {
  const html = readFileSync("index.html", "utf8");
  const css = readFileSync("testing.css", "utf8");
  const sections = [...html.matchAll(/data-rail-section/g)];
  const markers = [...html.matchAll(/data-section-marker=/g)];

  assert.equal(markers.length, sections.length);
  assert.equal((html.match(/<details/g) || []).length, 15);
  assert.equal((html.match(/Read project PDF/g) || []).length, 6);
  assert.match(html, /<script src="script\.js" defer>/);
  assert.match(html, /href="#main-content"/);
  assert.match(css, /\.nav \{[\s\S]*?position: sticky;/);
  assert.match(css, /content: "\+ More"/);
  assert.match(css, /prefers-reduced-motion/);
});
