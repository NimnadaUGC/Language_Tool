feat/global-settings

Implement the complete Global Settings experience for the CSB multilingual platform.

The master foundation and settings-precedence architecture already exist. Follow the project documentation and do not replace the shared settings model.

Primarily modify:

src/features/settings/**
settings-specific tests

Use additive changes in shared types only when necessary.

Create a settings page and a compact settings drawer accessible from writing workspaces.

SETTINGS SECTIONS

1. Typing

- Default language
- Default typing strategy
- Smart Typing preset
- Custom Smart Typing delay
- Auto-commit enabled/disabled
- Commit on Space
- Commit on Enter
- Commit on punctuation
- Preserve English words
- Suggestion behaviour
- Auto-correction level
- Personal mappings and dictionary entry point

2. Editor

- Default font
- Default font size
- Line spacing
- Paragraph spacing
- Page size
- Autosave interval
- Spell checking
- Word-count visibility
- Toolbar density

3. Output

- Default output mode
- Preferred Sinhala font mapping
- Preferred Tamil font mapping
- Preferred Hindi font mapping
- Plain-text or rich-text copy preference
- Default export format
- Include metadata in exports

4. Language

- Interface language foundation
- Preferred writing languages
- Numeral style
- Punctuation preferences
- Dictionary languages

5. Privacy

- Local-only mode
- Cloud-sync preference placeholder
- Store typing history
- Anonymous analytics preference
- Clear recent documents
- Delete OCR/voice temporary data
- Export personal settings
- Delete/reset local settings

6. Appearance and accessibility

- Light
- Dark
- System
- Compact/comfortable layout
- Reduced motion
- High contrast
- Language colour indicators
- Larger interface controls

PRECEDENCE

The interface must clearly distinguish:

- Global default
- Workspace override
- Document override

Provide “Use global default” and “Reset override” actions where applicable.

PERSISTENCE

- Persist global settings safely.
- Version the settings schema.
- Migrate older settings without losing user data.
- Add import/export as JSON.
- Validate imported settings.
- Reject invalid or unsupported values safely.
- Add reset-by-category and reset-all actions.

UX

- Search settings
- Category navigation
- Unsaved-change indication if applicable
- Accessible labels and descriptions
- Confirmation for destructive resets
- No reload required for theme or common typing preference changes

TESTS

Test:

- Precedence
- Persistence
- Migration
- Import/export
- Invalid imports
- Category reset
- Full reset
- Theme application
- Typing preference propagation

Run lint, tests and production build.

Return a summary, files changed, test results and a recommended commit message.