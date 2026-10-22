feat/translator

Implement the Sinhala, Tamil, Hindi and English translation workspace.

Primarily modify:

src/features/translator/**
translation-provider adapter implementation
feature-specific tests

Keep translation separate from transliteration.

The interface must clearly explain:

Transliteration:
ammaa → අම්මා

Translation:
අම්මා → mother

SUPPORTED LANGUAGES

- Sinhala
- Tamil
- Hindi
- English

Support any configured source-to-target combination.

INTERFACE

Implement:

- Source-language selector
- Target-language selector
- Auto-detect option
- Swap languages
- Source editor
- Translation result
- Copy source
- Copy translation
- Listen action through a configured speech service where available
- Send source to converter
- Send translation to document editor
- Translate selected document content
- Preserve paragraphs
- Character/usage indication
- Translation history foundation
- Clear

PROVIDER RULES

Use the shared TranslationProvider interface.

- Keep API keys outside source control.
- Use environment variables.
- Validate configuration.
- Handle rate limits.
- Handle unavailable language pairs.
- Handle network errors.
- Do not place fake translations into production.
- Do not silently fall back to transliteration.

FORMATTING

Preserve where possible:

- Paragraphs
- Line breaks
- Lists
- Headings
- Numbers
- URLs
- Email addresses

Add a clear warning when formatting cannot be preserved.

PRIVACY

Explain when text is sent to an external provider.

Respect local-only privacy settings by disabling remote translation when required.

TESTS

Test:

- Language pair selection
- Swap
- Auto-detection response handling
- Provider not configured
- Rate limit
- Network error
- Paragraph preservation
- Sending result to editor
- Local-only restriction

Run lint, tests and production build.

Return configured provider requirements, changed files, limitations, tests and recommended commit message.