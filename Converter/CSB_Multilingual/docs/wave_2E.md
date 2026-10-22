feat/resource-hubs

Implement the Font Library, Developer Hub and About/Technology pages.

Primarily modify:

src/features/font-hub/**
src/features/developer-hub/**
src/features/about/**
feature-specific tests

FONT LIBRARY

Create a font catalogue for Sinhala, Tamil and Hindi.

Each font entry must support:

- Name
- Script/language
- Unicode or legacy classification
- Free or paid classification
- Licence
- Author/foundry
- Preview
- Mapping support
- Download availability
- Embedding permission
- Version
- Tags
- Compatibility notes

Features:

- Search
- Filter by language
- Filter by Unicode/legacy
- Filter by free/paid
- Preview custom text
- Font-size adjustment
- Send selected font to converter/editor settings
- View mapping compatibility
- Safe download or external-source action

Do not distribute unlicensed font files.

DEVELOPER HUB

Build a professional developer area covering the existing or planned CSB developer ecosystem.

Prepare documentation sections for packages such as:

- Typing core
- Singlish
- Tanglish
- Hinglish
- Font mapping
- React integration
- Web component
- CDN integration
- Editor integration

Use actual package names found in the repository. Do not invent published package availability.

Include:

- Installation examples
- CDN examples
- Configuration
- Language options
- Smart Typing timing options
- Event callbacks
- API reference structure
- Mapping playground
- Browser support section
- Version/changelog section
- Copy-code actions

Code examples must be based on real exported APIs. Mark planned APIs clearly.

ABOUT PAGE

Explain:

- CSB Smart Typing
- Time-based key mapping
- Difference between Smart Typing and phonetic conversion
- Supported languages
- Unicode and font conversion
- Local-first writing
- Privacy approach
- Developer tools
- Product roadmap

Do not present “first in the world” or performance percentages as verified facts without configured evidence.

TESTS

Test:

- Font filters
- Font previews
- Licence display
- Safe download behaviour
- Developer code-copy actions
- Planned versus available API status
- Mobile layouts

Run lint, tests and production build.

Return summary, configured resources, missing metadata, files changed, tests and recommended commit message.