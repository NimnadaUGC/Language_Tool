You are working inside the existing CSB_MULTILINGUAL project.

The current application is a React + TypeScript + Vite multilingual typing application. It already contains working or partially working Singlish, Tanglish and Hinglish interfaces, CSB Smart Typing, phonetic conversion, language tabs, local document indicators, copy/download controls and existing design work.

The production domain will be:

language.csbodima.lk

PRODUCT PURPOSE

Transform the current application architecture into a scalable multilingual writing platform while keeping its most important core experience simple:

1. A user visits the platform.
2. Selects Singlish, Tanglish or Hinglish.
3. Selects CSB Smart Typing or Phonetic Converter.
4. Types naturally.
5. Receives Sinhala, Tamil or Hindi Unicode text.
6. Copies, downloads, exports or converts the result to a compatible font format.

The platform will later contain:

- General single-language converter
- Collective multilingual typing
- Global settings
- Local and cloud document library
- Unicode and legacy-font conversion
- Rich multilingual document editor
- File upload
- OCR
- Voice typing
- Typing speed tests
- Sinhala/Tamil/Hindi/English translation
- Font library
- Developer hub
- Free and paid plans

This task is ONLY the master architectural and interface foundation. Do not attempt to fully implement all later features.

CRITICAL SAFETY RULES

- Inspect the entire repository before modifying anything.
- Preserve all currently working typing/conversion behaviour.
- Do not delete existing mappings, typing algorithms, dictionaries, package integrations or keyboard mechanisms.
- Do not rewrite the CSB Smart Typing engine unless a clear architectural adapter is required.
- Move or wrap existing logic carefully and maintain backward compatibility.
- Do not hardcode unverified marketing claims such as “first in the world” or “85% of users”.
- Do not silently use fake OCR, translation, payment or voice results.
- Do not create unnecessary backend code if this repository is currently frontend-only.
- Prepare typed service interfaces for future backend functionality.
- Use the existing package manager, coding style and linting configuration.
- Use existing state-management or routing libraries when suitable.
- If no routing system exists, add a suitable lightweight routing setup.
- If no test system exists, add a suitable Vite-compatible test setup.
- Do not create duplicate vite.config files or duplicate TypeScript configurations.
- Remove obsolete generated configuration duplicates only after verifying which files are actively used.

ARCHITECTURAL GOAL

Refactor the project into a modular feature-based structure similar to the following. Adapt it to the actual repository instead of blindly recreating files:

src/
  app/
    layouts/
    providers/
    router/
    registry/
    configuration/
  components/
    ui/
    feedback/
    navigation/
  design-system/
    tokens/
    icons/
    typography/
  domain/
    typing/
    documents/
    fonts/
    account/
    exports/
  features/
    general-converter/
    collective-studio/
    document-editor/
    library/
    settings/
    font-converter/
    capture/
    typing-test/
    translator/
    font-hub/
    developer-hub/
    pricing/
    about/
  services/
    typing/
    storage/
    exports/
    fonts/
    ocr/
    speech/
    translation/
    account/
  workers/
  hooks/
  utils/
    unicode/
    browser/
  types/
  tests/

Do not create empty folders without a purpose.

CORE SHARED TYPES

Create clear reusable types, using naming suitable for the actual codebase:

LanguageId:
- si
- ta
- hi
- en

LanguageInputMode:
- singlish
- tanglish
- hinglish
- english

TypingStrategy:
- csb-smart
- phonetic
- direct

OutputMode:
- unicode
- legacy-font
- both

SmartTypingPreset:
- slow
- moderate
- fast
- custom

Create typed models for:

- LanguageDefinition
- TypingConfiguration
- TypingSession
- ConversionResult
- WritingDocument
- DocumentBlock
- DocumentMetadata
- FontDefinition
- FontMappingResult
- UserPreferences
- PlanEntitlements
- ExportRequest
- ServiceResult and service errors

A document block must be capable of remembering:

- Language
- Typing strategy
- Source/transliteration text
- Unicode text
- Selected font
- Formatting metadata
- Creation and update timestamps

CENTRAL LANGUAGE REGISTRY

Create one central language registry instead of scattering language information across components.

Every supported language configuration should contain:

- ID
- Input-mode ID
- English label
- Native label
- Brand colour token
- Unicode script
- Available typing strategies
- Default strategy
- Default output mode
- Available font mappings
- Placeholder text
- Example text
- Relevant keyboard shortcuts

The application should use this registry for tabs, route metadata, labels, colour accents and settings.

APPLICATION SHELL

Build a responsive application shell suitable for a serious writing platform.

Desktop:

- Compact top header
- Brand/logo area
- Main navigation
- Search or command entry placeholder
- Documents access
- Settings access
- Account/Guest control

Mobile:

- Compact header
- Bottom navigation or mobile menu
- Editor-safe layout
- No floating controls covering the typing area

The converter and editor workspace must appear above the fold. Do not use a giant landing-page hero on working routes.

Recommended route structure:

/write
/write/collective
/editor
/documents
/convert/fonts
/capture
/translate
/typing-test
/fonts
/developers
/settings
/pricing
/about

The landing route may redirect to /write or provide a compact product introduction without delaying access to typing.

FEATURE REGISTRY

Create a feature-registration pattern so parallel feature tasks can add their route, navigation and metadata without repeatedly modifying a large central App component.

A feature module should be able to expose:

- Feature ID
- Route
- Navigation entry
- Lazy-loaded page component
- Access requirement
- Feature status
- Optional keyboard shortcut

Use a safe implementation suitable for Vite and React. Document how future features are registered.

GLOBAL CONFIGURATION FOUNDATION

Prepare a settings system with three levels:

1. Global user settings
2. Workspace settings
3. Document overrides

Precedence:

Document override > Workspace setting > Global setting > Platform default

Create the store, context or state architecture and typed settings schema. Implement basic persistence for current settings, but leave detailed settings UI for the settings feature task.

Settings categories must be prepared for:

- Typing
- Editor
- Output
- Language
- Privacy
- Appearance
- Accessibility

SERVICE ADAPTERS

Create interfaces and adapters for:

- Existing CSB Smart Typing engine
- Existing phonetic converter
- Document repository
- User-preference repository
- Font-conversion service
- Export service
- OCR provider
- Speech-recognition provider
- Translation provider
- Authentication/account provider

Existing working conversion logic must be connected through the typing adapter rather than duplicated.

Provider-backed services that are not configured must return clear “not configured” states. They must never generate fake production results.

DESIGN SYSTEM

Extract reusable visual tokens for:

- Backgrounds
- Surfaces
- Borders
- Shadows
- Text
- Muted text
- Success/warning/error
- Focus rings
- Sinhala/Singlish accent
- Tamil/Tanglish accent
- Hindi/Hinglish accent
- English accent

Create reusable UI components only where genuinely shared:

- Button
- IconButton
- SegmentedControl
- Tabs
- Select
- Input
- Textarea
- Modal
- Drawer
- Tooltip
- Badge
- EmptyState
- ErrorState
- LoadingState
- UpgradeNotice
- StorageIndicator
- LanguageBadge

Preserve the current brand identity while improving consistency.

UNICODE REQUIREMENTS

Provide utility foundations for:

- Unicode normalization
- Grapheme-aware length
- Grapheme-safe deletion
- Selection and cursor handling
- Combining-character awareness
- Copying plain Unicode
- Preserving English words, email addresses, URLs and numbers

Do not treat all Unicode scripts as simple JavaScript character arrays.

DOCUMENTATION

Create:

docs/ARCHITECTURE.md
docs/FEATURE_REGISTRY.md
docs/LANGUAGE_MODEL.md
docs/SETTINGS_PRECEDENCE.md
docs/PARALLEL_TASK_BOUNDARIES.md
docs/ROADMAP.md
docs/QA_CHECKLIST.md

PARALLEL TASK BOUNDARIES

Document which shared files feature branches must not modify unless strictly necessary.

Each future feature should normally own:

src/features/<feature-name>/**
feature-specific tests
feature-specific styles
feature-specific service adapters

Shared-domain modifications must be additive and backward compatible.

INITIAL PLACEHOLDER ROUTES

Create usable, branded placeholder pages for future feature routes, but clearly label unfinished tools as “Coming soon” or “Foundation prepared”.

Do not simulate functionality.

QUALITY REQUIREMENTS

- Responsive from mobile to large desktop
- Keyboard accessible
- Visible focus states
- No important action hidden behind floating upgrade banners
- No language-state leakage
- No duplicated language definitions
- No TypeScript errors
- No lint errors
- Existing converter remains functional
- Production build succeeds

TESTS

Add or maintain tests for:

- Language registry
- Settings precedence
- Feature registration
- Existing typing adapter
- Language switching
- Basic route rendering
- Unicode utility behaviour
- Existing conversion behaviour where test cases already exist

FINAL OUTPUT

After implementation:

1. Run lint.
2. Run tests.
3. Run the production build.
4. Fix all errors introduced by the changes.
5. Provide:
   - Summary of architecture changes
   - Files added/changed
   - Existing functionality preserved
   - Commands executed
   - Test/build results
   - Important remaining tasks
   - Recommended commit message

Do not merely provide a plan. Inspect and implement the foundation in the repository.