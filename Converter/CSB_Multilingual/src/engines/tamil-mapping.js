// Complete deterministic Tanglish-to-Tamil phonetic mapping.
//
// A consonant key by itself produces the consonant with pulli (க்). Adding a
// vowel produces the corresponding uyirmei letter (க + aa -> கா). The ASCII
// aliases retain the package's original typing scheme; the optional ISO 15919
// aliases make every Tamil distinction available without overloading them.

const independentVowels = {
  a: 'அ',
  aa: 'ஆ', A: 'ஆ', 'ā': 'ஆ',
  i: 'இ',
  ii: 'ஈ', ee: 'ஈ', I: 'ஈ', 'ī': 'ஈ',
  u: 'உ',
  uu: 'ஊ', oo: 'ஊ', U: 'ஊ', 'ū': 'ஊ',
  e: 'எ',
  ae: 'ஏ', E: 'ஏ', 'ē': 'ஏ',
  ai: 'ஐ',
  o: 'ஒ',
  oa: 'ஓ', O: 'ஓ', 'ō': 'ஓ',
  au: 'ஔ', ou: 'ஔ', ow: 'ஔ'
};

const vowelSigns = {
  a: '',
  aa: 'ா', A: 'ா', 'ā': 'ா',
  i: 'ி',
  ii: 'ீ', ee: 'ீ', I: 'ீ', 'ī': 'ீ',
  u: 'ு',
  uu: 'ூ', oo: 'ூ', U: 'ூ', 'ū': 'ூ',
  e: 'ெ',
  ae: 'ே', E: 'ே', 'ē': 'ே',
  ai: 'ை',
  o: 'ொ',
  oa: 'ோ', O: 'ோ', 'ō': 'ோ',
  au: 'ௌ', ou: 'ௌ', ow: 'ௌ'
};

// The first aliases are the established everyday keys. Uppercase/extended
// forms provide explicit Tamil and Grantha distinctions when they are needed.
const consonantFamilies = [
  ['க', ['k', 'g', 'kh', 'gh']],
  ['ங', ['ng', 'nG', 'ṅ']],
  ['ச', ['c', 'ch']],
  ['ஜ', ['j', 'J']],
  ['ஞ', ['nj', 'gn', 'Gn', 'ñ']],
  ['ட', ['t', 'd', 'T', 'D', 'ṭ', 'ḍ']],
  ['ண', ['N', 'nx', 'ṇ']],
  ['த', ['th', 'dh']],
  ['ந', ['n', 'nh']],
  ['ப', ['p', 'b', 'ph', 'bh']],
  ['ம', ['m']],
  ['ய', ['y']],
  ['ர', ['r']],
  ['ல', ['l']],
  ['வ', ['v', 'w']],
  ['ழ', ['zh', 'z', 'ḻ']],
  ['ள', ['L', 'lx', 'ḷ']],
  ['ற', ['R', 'rx', 'ṟ']],
  ['ன', ['nH', 'nn', 'ṉ']],
  ['ஷ', ['sh', 'ṣ']],
  ['ஸ', ['s', 'S']],
  ['ஶ', ['Sh', 'ś']],
  ['ஹ', ['h']],
  ['க்ஷ', ['x', 'ksh', 'kSh']],
  ['ஃப', ['f', 'F']]
];

export const tamilPatternMap = {
  ...independentVowels,

  // Aytham and the Tamil OM sign.
  q: 'ஃ', Q: 'ஃ', H: 'ஃ',
  om: 'ௐ', Om: 'ௐ', OM: 'ௐ', aum: 'ௐ', AUM: 'ௐ',

  // Prefixing a number with # opts into Tamil digits and number symbols while
  // leaving ordinary ASCII numbers untouched.
  '#0': '௦', '#1': '௧', '#2': '௨', '#3': '௩', '#4': '௪',
  '#5': '௫', '#6': '௬', '#7': '௭', '#8': '௮', '#9': '௯',
  '#10': '௰', '#100': '௱', '#1000': '௲',
  '#day': '௳', '#month': '௴', '#year': '௵', '#debit': '௶',
  '#credit': '௷', '#above': '௸', '#rupee': '௹', '#number': '௺'
};

for (const [letter, aliases] of consonantFamilies) {
  for (const alias of aliases) {
    tamilPatternMap[alias] = `${letter}்`;
    for (const [vowel, sign] of Object.entries(vowelSigns)) {
      tamilPatternMap[`${alias}${vowel}`] = `${letter}${sign}`;
    }
  }
}

// ஸ்ரீ is conventionally encoded as a fixed Grantha cluster. These common
// Tamil and Sanskrit spellings intentionally resolve to the same sequence.
Object.assign(tamilPatternMap, {
  sri: 'ஸ்ரீ', srii: 'ஸ்ரீ', sree: 'ஸ்ரீ',
  Sri: 'ஸ்ரீ', Srii: 'ஸ்ரீ', Sree: 'ஸ்ரீ',
  shri: 'ஸ்ரீ', shrii: 'ஸ்ரீ', shree: 'ஸ்ரீ'
});

// Keep the matcher synchronized automatically when a longer alias is added.
export const tamilMaxPatternLength = Math.max(
  ...Object.keys(tamilPatternMap).map((pattern) => pattern.length)
);
