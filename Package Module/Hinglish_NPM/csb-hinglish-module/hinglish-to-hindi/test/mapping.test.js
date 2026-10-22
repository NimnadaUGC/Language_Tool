const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function loadMap() {
  const source = fs.readFileSync(path.join(__dirname, '../src/hindi-mapping.js'), 'utf8')
    .replaceAll('export const ', 'const ');
  return new Function(`${source}; return { map: hindiPatternMap, maxLength: hindiMaxPatternLength };`)();
}

function convert(map, input, maxLength = Math.max(...Object.keys(map).map((key) => key.length))) {
  let result = '';
  for (let index = 0; index < input.length;) {
    let match = '';
    for (let length = Math.min(maxLength, input.length - index); length; length -= 1) {
      const candidate = input.slice(index, index + length);
      if (Object.hasOwn(map, candidate)) { match = candidate; break; }
    }
    result += match ? map[match] : input[index];
    index += match ? match.length : 1;
  }
  return result;
}

test('maps Devanagari vowels and phonetic consonant distinctions', () => {
  const { map } = loadMap();
  assert.equal(map.a, 'अ');
  assert.equal(map.kaa, 'का');
  assert.equal(map.ki, 'कि');
  assert.equal(map.kee, 'की');
  assert.equal(map.T, 'ट्');
  assert.equal(map.th, 'थ्');
  assert.equal(map.Th, 'ठ्');
  assert.equal(map.q, 'क़्');
  assert.equal(map.f, 'फ़्');
  assert.equal(map.M, 'ं');
  assert.equal(map['R^i'], 'ऋ');
  assert.equal(map['R^I'], 'ॠ');
  assert.equal(map['L^i'], 'ऌ');
  assert.equal(map['L^I'], 'ॡ');
  assert.equal(map.ae, 'ऍ');
  assert.equal(map.aw, 'ऑ');
  assert.equal(map['kā'], 'का');
  assert.equal(map['kṛ'], 'कृ');
  assert.equal(map['kL^i'], 'कॢ');
  assert.equal(map['ṭhī'], 'ठी');
});

test('uses longest-match conversion for common Hinglish and conjunct forms', () => {
  const { map, maxLength } = loadMap();
  assert.equal(convert(map, 'namaste', maxLength), 'नमस्ते');
  assert.equal(convert(map, 'kaise ho', maxLength), 'कैसे हो');
  assert.equal(convert(map, 'chhoTaa', maxLength), 'छोटा');
  assert.equal(convert(map, 'shakti', maxLength), 'शक्ति');
  assert.equal(convert(map, 'ksha', maxLength), 'क्ष');
  assert.equal(convert(map, 'gya', maxLength), 'ज्ञ');
  assert.equal(convert(map, 'shree', maxLength), 'श्री');
  assert.equal(convert(map, 'rang', maxLength), 'रंग');
  assert.equal(convert(map, '#8', maxLength), '८');
});

test('covers Hindi letters, marks, nukta forms, and every reachable pattern', () => {
  const { map, maxLength } = loadMap();
  const mappedText = Object.values(map).join('');
  for (const letter of 'अआइईउऊऋॠऌॡएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळ') {
    assert.ok(mappedText.includes(letter), `missing Devanagari letter ${letter}`);
  }
  for (const form of ['क़', 'ख़', 'ग़', 'ज़', 'ड़', 'ढ़', 'फ़', 'य़', 'ऱ', 'ं', 'ँ', 'ः', 'ऽ', 'ॐ']) {
    assert.ok(mappedText.includes(form), `missing Hindi form ${form}`);
  }
  assert.equal(maxLength, Math.max(...Object.keys(map).map((key) => key.length)));
  assert.ok(Object.keys(map).length > 2000);
  const inputSource = fs.readFileSync(path.join(__dirname, '../src/hindi-input.js'), 'utf8');
  assert.match(inputSource, /convertWithMaximalMunch/);
  assert.match(inputSource, /Shared_Lexer\/lexer\.js/);
  assert.doesNotMatch(inputSource, /Math\.min\(5,/);
});

test('opens and positions the Hindi typing-speed popup like the Singlish control', () => {
  const indexSource = fs.readFileSync(path.join(__dirname, '../src/index.js'), 'utf8');
  const cssSource = fs.readFileSync(path.join(__dirname, '../src/hindi-toggle.css'), 'utf8');

  assert.match(indexSource, /setHindiInputEnabled/);
  assert.match(indexSource, /setHindiTypingDelay/);
  assert.match(indexSource, /showSettings: \(\) => setPopupOpen\(true\)/);
  assert.match(indexSource, /toggleSettings: \(event\) => handleSettingsActivation\(event\)/);
  assert.match(indexSource, /addEventListener\('click'/);
  assert.match(indexSource, /setPopupOpen\(!settingsPopup\.classList\.contains\('active'\)\)/);
  assert.doesNotMatch(indexSource, /onclick="window\.hinglishToHindi/);
  assert.doesNotMatch(indexSource, /ontouchend="window\.hinglishToHindi/);
  assert.doesNotMatch(indexSource, /addEventListener\('touchend'/);
  assert.doesNotMatch(indexSource, /addEventListener\('pointerdown'/);
  assert.match(indexSource, /requestAnimationFrame\(positionPopup\)/);
  assert.doesNotMatch(indexSource, /display: 'block'/);
  assert.doesNotMatch(indexSource, /settingsPopup\.style\.display = ''/);
  assert.doesNotMatch(indexSource, /settingsPopup\.style\.visibility = ''/);
  assert.match(indexSource, /let globalEventsBound = false/);
  assert.match(indexSource, /const adjustedRect = settingsPopup\.getBoundingClientRect\(\)/);
  assert.match(indexSource, /const deltaTop = top - adjustedRect\.top/);
  assert.match(indexSource, /const deltaLeft = left - adjustedRect\.left/);
  assert.doesNotMatch(indexSource, /maxWidth:/);
  assert.doesNotMatch(indexSource, /maxHeight:/);
  assert.match(indexSource, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(indexSource, /hindi-speed-meter-bar/);
  assert.match(cssSource, /touch-action: manipulation/);
  assert.doesNotMatch(cssSource, /hindi-settings-button:focus \+ \.hindi-speed-popup/);
  assert.match(cssSource, /z-index: 2147483647/);
  assert.doesNotMatch(indexSource, /⚙/);
});
