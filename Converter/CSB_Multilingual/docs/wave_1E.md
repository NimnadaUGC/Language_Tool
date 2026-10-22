feat/font-conversion

Implement the Unicode and legacy-font conversion subsystem and user interface.

Primarily modify:

src/features/font-converter/**
font-conversion service implementation
font registry and feature-specific tests

IMPORTANT

Changing the visual font family and converting Unicode into a legacy font encoding are different operations. The UI and code must keep them separate.

REQUIRED CONVERSION DIRECTIONS

Prepare and implement where verified mappings are available:

- Unicode to legacy font encoding
- Legacy font encoding to Unicode
- Legacy font A to legacy font B through a safe intermediate representation

Never invent mappings.

When a font mapping is not available or verified, display it as unsupported or coming soon.

Do not bundle or distribute copyrighted font files without permission.

FONT REGISTRY

Each font definition should support:

- ID
- Name
- Language/script
- Unicode or legacy type
- Mapping version
- Licence information
- Download or external source configuration
- Embedding permission
- Supported conversion directions
- Known limitations
- Preview availability

CONVERSION WORKSPACE

Create:

- Source format selector
- Target format/font selector
- Input panel
- Output panel
- Side-by-side comparison
- Conversion diagnostics
- Unmapped-character highlighting
- Conversion warning summary
- Copy result
- Copy rich text
- Download TXT
- Send to General Converter
- Send to Document Editor
- Clear

COPY ACTIONS

Implement distinct actions:

1. Copy Unicode
2. Copy as selected font encoding
3. Copy rich text with styling where supported

When copying a legacy-font encoding, display a clear notice that the destination computer may require the same font.

MAPPING ENGINE

- Keep mappings outside React components.
- Version mappings.
- Add validation.
- Report unmapped graphemes.
- Avoid lossy silent conversion.
- Include round-trip tests for verified mappings.
- Preserve numbers, punctuation, URLs and supported English text.

TESTS

Test:

- Unicode-to-font conversion
- Font-to-Unicode conversion
- Round-trip behaviour
- Unmapped characters
- Unsupported fonts
- Copy modes
- Registry validation
- Long text
- Combining characters

Run lint, tests and production build.

Return a summary, supported mappings, unsupported mappings, changed files, test results and a recommended commit message.