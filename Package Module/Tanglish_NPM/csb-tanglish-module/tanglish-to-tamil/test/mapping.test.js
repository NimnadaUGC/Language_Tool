const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function loadMap() {
  const source = fs.readFileSync(path.join(__dirname, '../src/tamil-mapping.js'), 'utf8')
    .replaceAll('export const ', 'const ');
  return new Function(`${source}; return { map: tamilPatternMap, maxLength: tamilMaxPatternLength };`)();
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

test('maps Tamil vowels and preferred dependent vowel signs', () => {
  const { map } = loadMap();
  assert.equal(map.a, 'அ');
  assert.equal(map.ka, 'க');
  assert.equal(map.kee, 'கீ');
  assert.equal(map.ko, 'கொ');
  assert.equal(map.koo, 'கூ');
  assert.equal(map.kau, 'கௌ');
  assert.equal(map['kā'], 'கா');
  assert.equal(map['kī'], 'கீ');
  assert.equal(map['kē'], 'கே');
  assert.equal(map['kō'], 'கோ');
});

test('keeps the approved Tamil consonant distinctions and aliases', () => {
  const { map } = loadMap();
  assert.equal(map.n, 'ந்');
  assert.equal(map.N, 'ண்');
  assert.equal(map.nH, 'ன்');
  assert.equal(map.nn, 'ன்');
  assert.equal(map.zh, 'ழ்');
  assert.equal(map.th, 'த்');
  assert.equal(map.ksh, 'க்ஷ்');
  assert.equal(map.s, 'ஸ்');
  assert.equal(map['ṅ'], 'ங்');
  assert.equal(map['ñ'], 'ஞ்');
  assert.equal(map['ṇ'], 'ண்');
  assert.equal(map['ṉ'], 'ன்');
  assert.equal(map['ḻ'], 'ழ்');
  assert.equal(map['ḷ'], 'ள்');
  assert.equal(map['ṟ'], 'ற்');
  assert.equal(map['ṣ'], 'ஷ்');
  assert.equal(map['ś'], 'ஶ்');
});

test('uses longest-match conversion for representative Tanglish input', () => {
  const { map, maxLength } = loadMap();
  assert.equal(convert(map, 'thamizh', maxLength), 'தமிழ்');
  assert.equal(convert(map, 'thottam', maxLength), 'தொட்டம்');
  assert.equal(convert(map, 'sri', maxLength), 'ஸ்ரீ');
  assert.equal(convert(map, 'shree', maxLength), 'ஸ்ரீ');
  assert.equal(convert(map, 'vaNakkam', maxLength), 'வணக்கம்');
  assert.equal(convert(map, '#1000', maxLength), '௲');
});

test('covers the Tamil script inventory and keeps every pattern reachable', () => {
  const { map, maxLength } = loadMap();
  const mappedText = Object.values(map).join('');
  for (const letter of 'அஆஇஈஉஊஎஏஐஒஓஔஃகஙசஞடணதநபமயரலவழளறனஜஶஷஸஹௐ') {
    assert.ok(mappedText.includes(letter), `missing Tamil letter ${letter}`);
  }
  assert.equal(maxLength, Math.max(...Object.keys(map).map((key) => key.length)));
  assert.ok(Object.keys(map).length > 1500);
  const inputSource = fs.readFileSync(path.join(__dirname, '../src/tamil-input.js'), 'utf8');
  assert.match(inputSource, /convertWithMaximalMunch/);
  assert.match(inputSource, /Shared_Lexer\/lexer\.js/);
  assert.doesNotMatch(inputSource, /Math\.min\(5,/);
});

test('opens and positions the Tamil typing-speed popup like the Singlish control', () => {
  const indexSource = fs.readFileSync(path.join(__dirname, '../src/index.js'), 'utf8');
  const cssSource = fs.readFileSync(path.join(__dirname, '../src/tamil-toggle.css'), 'utf8');

  assert.match(indexSource, /setTamilInputEnabled/);
  assert.match(indexSource, /setTamilTypingDelay/);
  assert.match(indexSource, /function updateTypingDelay\(delay\) \{ setTamilTypingDelay\(delay\); \}/);
  assert.match(indexSource, /showSettings: \(\) => setPopupOpen\(true\)/);
  assert.match(indexSource, /toggleSettings: \(event\) => handleSettingsActivation\(event\)/);
  assert.match(indexSource, /addEventListener\('click'/);
  assert.match(indexSource, /setPopupOpen\(!settingsPopup\.classList\.contains\('active'\)\)/);
  assert.doesNotMatch(indexSource, /onclick="window\.tanglishToTamil/);
  assert.doesNotMatch(indexSource, /ontouchend="window\.tanglishToTamil/);
  assert.doesNotMatch(indexSource, /addEventListener\('touchend'/);
  assert.doesNotMatch(indexSource, /addEventListener\('pointerdown'/);
  assert.match(indexSource, /requestAnimationFrame\(positionPopup\)/);
  assert.doesNotMatch(indexSource, /display: 'block'/);
  assert.doesNotMatch(indexSource, /display: '', visibility: ''/);
  assert.match(indexSource, /const adjustedRect = settingsPopup\.getBoundingClientRect\(\)/);
  assert.match(indexSource, /const deltaTop = top - adjustedRect\.top/);
  assert.match(indexSource, /const deltaLeft = left - adjustedRect\.left/);
  assert.doesNotMatch(indexSource, /maxWidth:/);
  assert.doesNotMatch(indexSource, /maxHeight:/);
  assert.match(indexSource, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(indexSource, /tamil-speed-meter-bar/);
  assert.match(cssSource, /touch-action: manipulation/);
  assert.doesNotMatch(cssSource, /tamil-settings-button:focus \+ \.tamil-speed-popup/);
  assert.match(cssSource, /z-index: 2147483647/);
  assert.doesNotMatch(indexSource, /⚙/);
});
