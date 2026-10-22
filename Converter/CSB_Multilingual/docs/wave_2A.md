feat/document-editor

Implement the CSB multilingual rich document editor.

Use the existing document, block, settings, font, library and export contracts. Do not create a second document-storage system.

Primarily modify:

src/features/document-editor/**
editor-specific adapters and tests

Select a mature React-compatible rich-text editor approach that works with the current repository. Document the choice. Avoid unnecessary complexity.

MVP FORMATTING

Implement:

- Undo and redo
- Paragraph
- Headings
- Bold
- Italic
- Underline
- Strike-through
- Text colour
- Highlight
- Font family
- Font size
- Alignment
- Bulleted list
- Numbered list
- Indentation
- Line spacing
- Links
- Tables
- Images
- Horizontal rule
- Page break
- Find and replace
- Word and character counts

MULTILINGUAL REQUIREMENTS

- Sinhala
- Tamil
- Hindi
- English
- CSB Smart Typing
- Phonetic conversion
- Direct English typing
- Per-block or per-paragraph language metadata
- Quick language switching
- Quick typing-strategy switching
- Unicode-safe cursor and selection behaviour
- Language-aware font selection
- Mixed-language copy and export

DOCUMENT OPERATIONS

- New
- Open
- Save
- Save as
- Rename
- Autosave
- Duplicate
- Export
- Send selected content to converter
- Insert converted text from converter
- Recover autosave

TEMPLATES

Add an extensible template model and a small initial set:

- Blank document
- Formal letter
- Business letter
- Assignment
- Report
- Meeting minutes
- Social-media post

Do not include collaboration, comments or track changes in this task unless already supported without architectural damage.

EXPORTS

Connect to the shared export service for:

- TXT
- Markdown
- RTF where supported
- DOCX where supported
- PDF where supported
- Rich-text copy

Do not fake successful exports. Surface limitations honestly.

TESTS

Test:

- Mixed-language editing
- Formatting
- Language switching
- Save/autosave
- Templates
- Export commands
- Copy/paste
- Undo/redo
- Unicode combining characters
- Mobile toolbar behaviour

Run lint, tests and production build.

Return implementation summary, editor-library decision, changed files, supported exports, known limitations and recommended commit message.