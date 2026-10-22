# Hinglish to Hindi Converter (v 1.0.0)

A real-time Hinglish (Romanized Hindi) to Hindi Unicode converter for web input fields.

## Features

- Convert Hinglish text to Hindi as you type
- Works with all input fields, textareas, and contenteditable elements
- Toggle conversion on/off with a floating button
- Adjustable typing speed (Slow, Moderate, Fast) via settings in the toggle
- Compact native speed selector with a volume-bar style UI
- Responsive preset placement with smart-fit popup positioning
- Customizable colors, fonts, radius, and shadow via JavaScript options or CSS variables
- Remembers user preferences (enabled state and typing speed) via localStorage
- Deterministic phonetic mapping for Devanagari vowels, consonants, conjuncts, nukta letters, and marks
- Adapts to dynamically added input elements
- Multiple export formats (ES Module, CommonJS, UMD)

## Installation

```bash
npm install hinglish-to-hindi
```

## Usage

### Basic Usage

```javascript
// ES Modules
import hinglishToHindi from 'hinglish-to-hindi';

// Initialize with default options
const hindi = hinglishToHindi();

// Or with custom options
const hindiCustom = hinglishToHindi({
  autoAddToggle: true,
  togglePosition: 'top-right',
  startEnabled: true,
  placement: {
    offsetX: 20,
    offsetY: 20,
    smartFit: true
  },
  theme: {
    fontFamily: 'system-ui, sans-serif',
    baseFontSize: '14px',
    background: 'rgba(35, 35, 35, 0.88)',
    textColor: '#ffffff',
    accentColor: '#129cff',
    mutedColor: 'rgba(255,255,255,0.62)',
    borderColor: 'rgba(255,255,255,0.22)',
    toggleOffColor: '#555555',
    radius: '28px',
    shadow: '0 12px 28px rgba(0,0,0,0.28)'
  }
});
```

### In HTML (via CDN)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hinglish-to-hindi/dist/hindi-toggle.css">
<script src="https://cdn.jsdelivr.net/npm/hinglish-to-hindi/dist/hinglish-to-hindi.min.js"></script>
<script>
  // Initialize
  const hindi = HinglishToHindi();
</script>
```

### API Reference

The library returns an API object with the following methods:

```javascript
// Enable Hinglish to Hindi conversion
hindi.enable();

// Disable conversion
hindi.disable();

// Check if conversion is enabled
const isEnabled = hindi.isEnabled();

// Toggle conversion on/off
hindi.toggle();

// Set the typing speed
// Speed can be 'slow', 'moderate', or 'fast'
hindi.setTypingSpeed('fast');

// Get the current typing speed
const currentSpeed = hindi.getTypingSpeed(); // Returns 'slow', 'moderate', or 'fast'

// Update visual theme after initialization
hindi.setTheme({
  accentColor: '#00a86b',
  radius: '22px'
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| autoAddToggle | boolean | true | Automatically add the toggle button |
| togglePosition | string | 'bottom-right' | Position of toggle ('top-right', 'top-left', 'bottom-right', 'bottom-left') |
| startEnabled | boolean | false | Start with conversion enabled |
| placement | object | `{ offsetX: 20, offsetY: 20, smartFit: true }` | Toggle offset and viewport-aware popup fitting |
| theme | object | `{}` | Visual tokens mapped to CSS variables on the toggle container |

## CSS Customization

CDN and stylesheet users can override the same visual tokens with CSS variables:

```css
.hindi-toggle-container {
  --hindi-toggle-font-family: system-ui, sans-serif;
  --hindi-toggle-base-font-size: 14px;
  --hindi-toggle-background: rgba(35, 35, 35, 0.88);
  --hindi-toggle-text-color: #ffffff;
  --hindi-toggle-accent-color: #129cff;
  --hindi-toggle-muted-color: rgba(255, 255, 255, 0.62);
  --hindi-toggle-border-color: rgba(255, 255, 255, 0.22);
  --hindi-toggle-off-color: #555555;
  --hindi-toggle-radius: 28px;
  --hindi-toggle-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}
```

## Writing Hinglish

Type Hinglish text in any input field, and it will be converted to Hindi in real-time. The converter is deterministic and offline: it maps the phonetic spelling you type; it does not use a dictionary or candidate suggestions.

- `namaste` → `नमस्ते`
- `kaise ho` → `कैसे हो`
- `chhoTaa` → `छोटा`
- `shakti` → `शक्ति`
- `gya` → `ज्ञ`
- `shree` → `श्री`

The finalized mapping includes:

- Vowels: `a`, `aa`/`A`, `i`, `ii`/`ee`/`I`, `u`, `uu`/`oo`/`U`,
  `e`/`E`, `ai`, `o`/`O`, and `au`/`ou`. Use `ae` for ऍ and `aw` for ऑ.
- Retroflex letters: `T`, `Th`, `D`, `Dh`, `N`; their diacritic forms
  `ṭ`, `ṭh`, `ḍ`, `ḍh`, `ṇ` are also accepted.
- Nasals and sibilants: `Ng`/`ṅ` → ङ, `Ny`/`ñ` → ञ, `sh` → श,
  `Sh`/`ṣ` → ष, and `s` → स.
- Nukta letters: `q` → क़, `K`/`khh` → ख़, `G`/`ghh` → ग़,
  `z` → ज़, `R` → ड़, `Rh` → ढ़, `f` → फ़, and `Y` → य़.
- Conjuncts: `ksh` → क्ष्, `tr` → त्र्, `gy`/`jn` → ज्ञ्, and
  `shr` → श्र्. Add a vowel normally (`ksha` → क्ष, `gya` → ज्ञ).
- Marks: `M`/`ṃ` → ं, `MM`/`~` →ँ, `H`/`ḥ` → ः, apostrophe → ऽ,
  `.`/`|` → ।, and `..`/`||` → ॥.
- Vocalic vowels: `R^i`/`ṛ` → ऋ, `R^I`/`ṝ` → ॠ, `L^i` → ऌ,
  and `L^I` → ॡ. After a consonant, `kri`/`kṛ` → कृ.
- Prefix a digit with `#` for Devanagari numerals (`#8` → `८`).

As in the Sinhala package, a consonant key by itself is explicit and therefore
has virama (`k` → `क्`); add `a` when the written consonant must retain its
inherent vowel (`ka` → `क`).

## Browser Support

Supported in all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
