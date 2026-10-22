// Complete deterministic Hinglish-to-Hindi phonetic mapping.
//
// Bare consonants carry a virama (k -> क्); adding a vowel produces the full
// akshara (ka -> क, kii -> की). Existing everyday ASCII keys are preserved,
// with optional IAST aliases for distinctions that ASCII cannot express well.

const independentVowels = {
  a: 'अ',
  aa: 'आ', A: 'आ', 'ā': 'आ',
  i: 'इ',
  ii: 'ई', ee: 'ई', I: 'ई', 'ī': 'ई',
  u: 'उ',
  uu: 'ऊ', oo: 'ऊ', U: 'ऊ', 'ū': 'ऊ',
  'ṛ': 'ऋ', 'r̥': 'ऋ', 'R^i': 'ऋ',
  'ṝ': 'ॠ', 'r̥̄': 'ॠ', 'R^I': 'ॠ',
  'L^i': 'ऌ', 'l̥': 'ऌ',
  'L^I': 'ॡ', 'l̥̄': 'ॡ',
  e: 'ए', E: 'ए',
  ai: 'ऐ', AI: 'ऐ',
  o: 'ओ', O: 'ओ',
  au: 'औ', ou: 'औ', AU: 'औ',

  // Candra vowels are useful for English loanwords such as ऑटो.
  ae: 'ऍ', 'ê': 'ऍ', aw: 'ऑ', 'ô': 'ऑ'
};

const vowelSigns = {
  a: '',
  aa: 'ा', A: 'ा', 'ā': 'ा',
  i: 'ि',
  ii: 'ी', ee: 'ी', I: 'ी', 'ī': 'ी',
  u: 'ु',
  uu: 'ू', oo: 'ू', U: 'ू', 'ū': 'ू',
  ri: 'ृ', 'ṛ': 'ृ', 'r̥': 'ृ', 'R^i': 'ृ',
  Rri: 'ॄ', RRi: 'ॄ', 'ṝ': 'ॄ', 'r̥̄': 'ॄ', 'R^I': 'ॄ',
  Lri: 'ॢ', 'L^i': 'ॢ', 'l̥': 'ॢ',
  LLri: 'ॣ', 'L^I': 'ॣ', 'l̥̄': 'ॣ',
  e: 'े', E: 'े',
  ai: 'ै', AI: 'ै',
  o: 'ो', O: 'ो',
  au: 'ौ', ou: 'ौ', AU: 'ौ',
  ae: 'ॅ', 'ê': 'ॅ', aw: 'ॉ', 'ô': 'ॉ'
};

// Uppercase T/D/N retain the established retroflex convention. IAST aliases
// are included as an unambiguous alternative, and nukta letters cover modern
// Hindi loanwords.
const consonantFamilies = [
  ['क', ['k']], ['ख', ['kh']], ['ग', ['g']], ['घ', ['gh']],
  ['ङ', ['Ng', 'ṅ']],
  ['च', ['c', 'ch']], ['छ', ['chh', 'Ch']], ['ज', ['j']], ['झ', ['jh']],
  ['ञ', ['Ny', 'ñ']],
  ['ट', ['T', 'ṭ']], ['ठ', ['Th', 'ṭh']], ['ड', ['D', 'ḍ']],
  ['ढ', ['Dh', 'ḍh']], ['ण', ['N', 'ṇ']],
  ['त', ['t']], ['थ', ['th']], ['द', ['d']], ['ध', ['dh']], ['न', ['n']],
  ['प', ['p']], ['फ', ['ph']], ['ब', ['b']], ['भ', ['bh']], ['म', ['m']],
  ['य', ['y']], ['र', ['r']], ['ल', ['l']], ['ळ', ['L', 'ḷ']],
  ['व', ['v', 'w']], ['श', ['sh', 'ś']], ['ष', ['Sh', 'ṣ']],
  ['स', ['s']], ['ह', ['h']],

  // Nukta consonants. Decomposed Unicode spellings are intentional and NFC
  // compatible with the corresponding precomposed Devanagari characters.
  ['क़', ['q']], ['ख़', ['K', 'khh']], ['ग़', ['G', 'ghh']],
  ['ज़', ['z']], ['ड़', ['R']], ['ढ़', ['Rh']], ['फ़', ['f']],
  ['य़', ['Y']], ['ऱ', ['rr']]
];

export const hindiPatternMap = {
  ...independentVowels,

  // Nasalization, visarga, avagraha, OM, and Devanagari punctuation.
  M: 'ं', 'ṃ': 'ं', 'ṁ': 'ं', '.n': 'ं',
  MM: 'ँ', '~': 'ँ', '~n': 'ँ',
  H: 'ः', 'ḥ': 'ः',
  "'": 'ऽ', '.a': 'ऽ',
  om: 'ॐ', Om: 'ॐ', OM: 'ॐ', aum: 'ॐ', AUM: 'ॐ',
  '.': '।', '..': '॥', '|': '।', '||': '॥',

  // # explicitly opts into native digits, avoiding surprising conversion of
  // ordinary ASCII numbers in mixed Hindi/English text.
  '#0': '०', '#1': '१', '#2': '२', '#3': '३', '#4': '४',
  '#5': '५', '#6': '६', '#7': '७', '#8': '८', '#9': '९'
};

function addConsonantFamily(letter, aliases) {
  for (const alias of aliases) {
    hindiPatternMap[alias] = `${letter}्`;
    for (const [vowel, sign] of Object.entries(vowelSigns)) {
      hindiPatternMap[`${alias}${vowel}`] = `${letter}${sign}`;
    }
  }
}

for (const [letter, aliases] of consonantFamilies) {
  addConsonantFamily(letter, aliases);
}

// Conventional Hindi/Sanskrit conjuncts. Each alias is a consonant stem, so
// gy + a -> ज्ञ while gy by itself -> ज्ञ्. This avoids the old gya collision.
for (const [cluster, aliases] of [
  ['क्ष', ['x', 'ksh']],
  ['त्र', ['tr']],
  ['ज्ञ', ['gy', 'jn', 'jny']],
  ['श्र', ['shr']]
]) {
  addConsonantFamily(cluster, aliases);
}

// Everyday “ng” represents anusvara + ग (rang -> रंग), while Ng/ṅ above are
// available for the uncommon independent letter ङ. Include every vowel form.
hindiPatternMap.ng = 'ंग';
for (const [vowel, sign] of Object.entries(vowelSigns)) {
  hindiPatternMap[`ng${vowel}`] = `ंग${sign}`;
}

export const hindiMaxPatternLength = Math.max(
  ...Object.keys(hindiPatternMap).map((pattern) => pattern.length)
);
