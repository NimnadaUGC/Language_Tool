# Tanglish to Tamil Converter (v1.0.0)

A real-time Tanglish (Romanized Tamil) to Tamil Unicode converter for web input fields.

## Installation

```bash
npm install tanglish-to-tamil
```

## Usage

```js
import tanglishToTamil from 'tanglish-to-tamil';

const tamil = tanglishToTamil({
  autoAddToggle: true,
  togglePosition: 'bottom-right',
  startEnabled: false,
  placement: { offsetX: 20, offsetY: 20, smartFit: true }
});

tamil.enable();
tamil.setTypingSpeed('fast');
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tanglish-to-tamil/dist/tamil-toggle.css">
<script src="https://cdn.jsdelivr.net/npm/tanglish-to-tamil/dist/tanglish-to-tamil.min.js"></script>
<script>
  const tamil = TanglishToTamil();
</script>
```

## API

The initializer returns `enable`, `disable`, `isEnabled`, `toggle`, `setTypingSpeed`, `getTypingSpeed`, and `setTheme`. Speed values are `slow`, `moderate`, and `fast`.

## Writing Tanglish

The converter uses a deterministic, extended phonetic map. A consonant alone
adds pulli (`k` → `க்`); adding a vowel creates an uyirmei (`ka` → `க`,
`kii` → `கீ`).

- Vowels: `a`, `aa`/`A`, `i`, `ii`/`ee`/`I`, `u`, `uu`/`oo`/`U`,
  `e`, `ae`/`E`, `ai`, `o`, `oa`/`O`, and `au`/`ou`/`ow`.
- Native distinctions: `ng` → ங, `nj` → ஞ, `N` → ண, `n` → ந,
  `nH`/`nn` → ன, `zh` → ழ, `L` → ள, and `R` → ற.
- Common aliases: `k`/`g`, `ch`, `t`/`d`, `th`/`dh`, `p`/`b`, and
  `v`/`w`.
- Grantha and loanword forms: `j`, `sh`, `s`/`S`, `Sh`, `h`, `f`,
  `ksh`, and `sri`/`shree`.
- Aytham and OM: `q`/`Q`/`H` → ஃ; `om`/`aum` → ௐ.
- Prefix digits with `#` for Tamil numerals (`#7` → `௭`). `#10`, `#100`,
  `#1000`, `#day`, `#month`, `#year`, and `#rupee` provide Tamil symbols.

The map also accepts unambiguous romanization keys such as `ā`, `ī`, `ū`,
`ē`, `ō`, `ṅ`, `ñ`, `ṇ`, `ṉ`, `ḻ`, `ḷ`, `ṟ`, `ś`, and `ṣ`.

Examples: `thamizh` → `தமிழ்`, `thottam` → `தொட்டம்`, `vaNakkam` →
`வணக்கம்`, and `shree` → `ஸ்ரீ`.

This is character and syllable transliteration, not a dictionary or language-model converter. Ambiguous spellings must use the documented distinctions.

## Browser Support

Chrome, Firefox, Safari, and Edge.

## License

MIT
