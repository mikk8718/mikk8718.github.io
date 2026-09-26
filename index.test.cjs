// Run: node index.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
const spans = [...html.matchAll(/<span lang="(en|da)"( hidden)?>/g)]
  .map(([, lang, hidden]) => ({ lang, hidden: Boolean(hidden) }));
const buttons = ['en', 'da'].map(language => ({
  dataset: { language },
  setAttribute(name, value) { this[name] = value; },
  addEventListener(event, callback) { this[event] = callback; }
}));
const navigation = { hidden: true };
const document = {
  documentElement: { lang: 'en' },
  querySelectorAll: selector => selector === 'span[lang]' ? spans : buttons,
  querySelector: () => navigation
};
vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], { document });
assert.equal(navigation.hidden, false);
assert.ok(spans.length > 0);
assert.equal(spans.filter(s => s.lang === 'en').length, spans.filter(s => s.lang === 'da').length);
for (const language of ['da', 'en', 'da']) {
  buttons.find(b => b.dataset.language === language).click();
  assert.equal(document.documentElement.lang, language);
  assert.ok(document.title.includes(language === 'da' ? 'Lidt om mig' : 'A little about me'));
  for (const span of spans) assert.equal(span.hidden, span.lang !== language);
  for (const button of buttons) assert.equal(button['aria-pressed'], String(button.dataset.language === language));
}
assert.ok(fs.existsSync(`${__dirname}/me.png`));
console.log('Language toggle, translated visibility, title, button states and portrait: OK');
