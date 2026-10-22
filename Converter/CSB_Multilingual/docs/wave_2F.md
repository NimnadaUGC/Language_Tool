feat/plans-and-access

Implement the plan-entitlement and upgrade experience for the CSB multilingual platform.

Primarily modify:

src/features/pricing/**
account/entitlement adapters owned by this feature
feature-specific tests

Do not implement fake payment success.

PLANS

Prepare configurable entitlements for:

Guest Free:

- Three local documents
- Basic converter
- Basic editor
- Basic exports
- Limited configured trials for provider-backed features
- Local settings

Registered Free:

- Account-based settings foundation
- Cloud-document entitlement foundation
- Limited OCR/voice/translation quotas
- Basic templates

Pro:

- No advertisements
- Larger document-storage entitlement
- Advanced exports
- Premium templates
- Version-history entitlement
- Batch conversion
- Larger provider quotas
- Premium-font access where licensing permits

All values must be configurable rather than scattered hardcoded numbers.

UPGRADE EXPERIENCE

Remove or replace intrusive floating Go Pro controls that cover the editor.

Use:

- Header account/plan area
- Pricing page
- Storage-limit notice
- Contextual locked-feature notice
- Non-blocking sidebar card where appropriate

ADVERTISEMENTS

Prepare safe advertisement slots for free users.

Rules:

- Never cover text input or output
- Never shift the cursor unexpectedly
- Never interrupt active typing
- No ads for Pro entitlements
- Keep ads disabled when no real ad provider is configured

ACCOUNT PROVIDER

Use the shared account interface.

When authentication or billing is not configured:

- Display an honest development/setup state.
- Do not create fake sessions.
- Do not simulate successful checkout.
- Keep guest/local functionality operational.

PRICING UI

Include:

- Clear feature comparison
- Monthly/yearly foundation if configured
- FAQ
- Storage explanation
- Local versus cloud explanation
- Upgrade and manage-plan actions
- Restore-purchase/account action foundation

TESTS

Test:

- Entitlement checks
- Guest document limit
- Locked features
- Pro ad removal
- Unconfigured checkout
- Upgrade notice positioning
- Responsive pricing page

Run lint, tests and production build.

Return summary, entitlement configuration, changed files, tests and recommended commit message.