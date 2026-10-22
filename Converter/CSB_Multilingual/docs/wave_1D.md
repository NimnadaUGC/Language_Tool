feat/collective-typing

Implement the Collective Multilingual Typing Studio.

This is a mixed-language writing workspace, not another single-language converter.

Primarily modify:

src/features/collective-studio/**
feature-specific tests

Use the shared DocumentBlock and typing-engine adapters.

SUPPORTED MODES

- Singlish to Sinhala
- Tanglish to Tamil
- Hinglish to Hindi
- Direct English typing

SUPPORTED STRATEGIES

- CSB Smart Typing
- Phonetic Converter
- Direct typing for English

CORE EXPERIENCE

Allow a user to create one document containing different language blocks or paragraphs.

Every block must remember:

- Language
- Input mode
- Typing strategy
- Smart Typing speed
- Source text where applicable
- Unicode result
- Selected font preference
- Timestamps

INTERFACE

Provide:

- Language switcher near the editor
- Strategy switcher
- Active-language indicator near the cursor or current block
- Add-language-block action
- Reorder blocks
- Duplicate block
- Delete block
- Convert selected block
- Set current mode as default for new blocks
- Document title
- Save/autosave
- Word and character counts by document and language
- Mobile-friendly language switching

KEYBOARD SHORTCUTS

Implement:

- Alt+1 Sinhala
- Alt+2 Tamil
- Alt+3 Hindi
- Alt+4 English

Use alternatives when these shortcuts conflict with the platform or browser and document the final choice.

Also provide shortcuts for strategy switching and adding a block.

BEHAVIOUR

- Existing content must not be retransformed when the active language changes.
- Each block retains its original language and strategy.
- Selection, cursor and undo behaviour must remain stable.
- Combining characters must be handled safely.
- English names, URLs, numbers and email addresses must remain intact.
- Copy all as Unicode.
- Copy selected block.
- Export the mixed-language document.
- Send document to the rich editor through a clean handoff contract.

Do not attempt to build the full rich document editor inside this task.

TESTS

Test:

- Per-block language state
- Per-block strategy
- Keyboard shortcuts
- Reordering
- Duplicating
- Deleting
- Mixed-language copying
- Save/autosave
- Switching without state leakage
- Mobile interaction

Run lint, tests and production build.

Return a summary, changed files, test results and a recommended commit message.