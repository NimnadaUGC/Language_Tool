# Singlish to Sinhala Converter (v 1.5.0)

A real-time Singlish (Romanized Sinhala) to Sinhala Unicode converter for web input fields.

## Features

- Convert Singlish text to Sinhala as you type
- Works with all input fields, textareas, and contenteditable elements
- Toggle conversion on/off with a floating button
- Adjustable typing speed (Slow, Moderate, Fast) via settings in the toggle
- Compact native speed selector with a volume-bar style UI
- Responsive preset placement with smart-fit popup positioning
- Customizable colors, fonts, radius, and shadow via JavaScript options or CSS variables
- Remembers user preferences (enabled state and typing speed) via localStorage
- Comprehensive character mapping covering all Sinhala characters
- Adapts to dynamically added input elements
- Multiple export formats (ES Module, CommonJS, UMD)

## Installation

```bash
npm install singlish-to-sinhala
```

## Usage

### Basic Usage

```javascript
// ES Modules
import singlishToSinhala from 'singlish-to-sinhala';

// Initialize with default options
const sinhala = singlishToSinhala();

// Or with custom options
const sinhalaCustom = singlishToSinhala({
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/singlish-to-sinhala/dist/sinhala-toggle.css">
<script src="https://cdn.jsdelivr.net/npm/singlish-to-sinhala/dist/singlish-to-sinhala.min.js"></script>
<script>
  // Initialize
  const sinhala = SinglishToSinhala();
</script>
```

### API Reference

The library returns an API object with the following methods:

```javascript
// Enable Singlish to Sinhala conversion
sinhala.enable();

// Disable conversion
sinhala.disable();

// Check if conversion is enabled
const isEnabled = sinhala.isEnabled();

// Toggle conversion on/off
sinhala.toggle();

// Set the typing speed
// Speed can be 'slow', 'moderate', or 'fast'
sinhala.setTypingSpeed('fast');

// Get the current typing speed
const currentSpeed = sinhala.getTypingSpeed(); // Returns 'slow', 'moderate', or 'fast'

// Update visual theme after initialization
sinhala.setTheme({
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
.sinhala-toggle-container {
  --sinhala-toggle-font-family: system-ui, sans-serif;
  --sinhala-toggle-base-font-size: 14px;
  --sinhala-toggle-background: rgba(35, 35, 35, 0.88);
  --sinhala-toggle-text-color: #ffffff;
  --sinhala-toggle-accent-color: #129cff;
  --sinhala-toggle-muted-color: rgba(255, 255, 255, 0.62);
  --sinhala-toggle-border-color: rgba(255, 255, 255, 0.22);
  --sinhala-toggle-off-color: #555555;
  --sinhala-toggle-radius: 28px;
  --sinhala-toggle-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}
```

## Writing Singlish

Type Singlish text in any input field, and it will be converted to Sinhala in real-time. Here are some examples:

- `mama` → `මම`
- `oyaata kohomada` → `ඔයාට කොහොමද`
- `aayuboewan lankawa` → `ආයුබෝවන් ලංකාව`

## Browser Support

Supported in all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
