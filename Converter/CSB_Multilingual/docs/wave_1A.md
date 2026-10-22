feat/general-converter

Implement the production-quality General Conversion View for the CSB multilingual platform.

The master platform foundation has already been completed. Inspect and follow:

- docs/ARCHITECTURE.md
- docs/FEATURE_REGISTRY.md
- docs/LANGUAGE_MODEL.md
- docs/PARALLEL_TASK_BOUNDARIES.md

FEATURE OWNERSHIP

Primarily modify:

src/features/general-converter/**
feature-specific tests

Use existing shared services and types. Do not redesign shared architecture or duplicate the typing engines.

PURPOSE

Create the fastest and simplest core experience on language.csbodima.lk.

A user must be able to:

1. Select Singlish, Tanglish or Hinglish.
2. Select CSB Smart Typing or Phonetic Converter.
3. Type source/transliteration text.
4. Receive the corresponding Sinhala, Tamil or Hindi Unicode result.
5. Copy or export the result easily.

REQUIRED UI

Create a compact workspace with:

- Language tabs
- Native language labels
- CSB Smart Typing / Phonetic segmented control
- Typing-speed selector shown only for CSB Smart Typing
- Output selector:
  - Unicode
  - Font format
  - Both
- Source panel
- Unicode result panel
- Optional font-result panel when enabled
- Resizable desktop panels where practical
- Mobile stacked layout
- Full-screen writing mode
- Word count
- Character count
- Autosave status
- Active language/mode indicator

CSB SMART TYPING EXPERIENCE

Provide:

- Slow, Moderate and Fast presets
- Custom delay support if allowed by shared settings
- Visible pending/commit state
- Manual commit action
- Undo last conversion
- Clear explanation of the selected timing behaviour
- No repeated “Moderate CSB Smart Typing” labels throughout the screen

ACTIONS

Implement:

- Copy Unicode
- Copy source
- Copy as configured font through the font-service interface
- Copy rich text when supported
- Download TXT
- Download Markdown
- Share through the browser sharing API when available
- Clear with confirmation when meaningful content exists
- Save document through the document-repository interface

When an output method is not configured, display an honest disabled or unsupported state.

KEYBOARD SHORTCUTS

Provide and document sensible shortcuts for:

- Switching language
- Switching typing strategy
- Copying result
- Saving
- Clearing
- Manual Smart Typing commit
- Full-screen mode

BEHAVIOUR REQUIREMENTS

- Switching language must not leak the previous language’s output or mapping state.
- Each language may keep a separate temporary draft.
- English words, numbers, URLs and email addresses must remain safe.
- Selection and cursor positions must remain stable where possible.
- Existing CSB Smart Typing behaviour must be accessed through the shared typing adapter.
- Do not duplicate conversion logic inside React components.
- No giant marketing hero on this page.
- No floating Go Pro control may cover the editor.

TESTS

Add tests for:

- Language switching
- Strategy switching
- Typing-speed settings
- Source-to-result update
- State isolation
- Copy actions
- Clear confirmation
- Save integration
- Mobile rendering
- Unconfigured font-service behaviour

Run lint, tests and production build.

Return a summary, changed files, test results and a recommended commit message.