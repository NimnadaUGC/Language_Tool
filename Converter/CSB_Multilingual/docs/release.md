release/multilingual-platform-integration

Perform the final integration and quality-assurance pass for the CSB multilingual platform.

All completed feature branches have now been merged.

Do not introduce major new features. Stabilise, connect, simplify and test the platform.

PRIMARY PRODUCT FLOW

The most important flow must remain the easiest:

1. Open language.csbodima.lk.
2. Reach the General Converter immediately.
3. Select Singlish, Tanglish or Hinglish.
4. Select CSB Smart Typing or Phonetic Converter.
5. Type.
6. Receive Sinhala, Tamil or Hindi Unicode.
7. Copy, save, export or convert to font format.

Audit the entire product to ensure secondary tools support this flow rather than hiding it.

INTEGRATION TASKS

- Resolve duplicate types
- Resolve duplicate language definitions
- Resolve duplicate storage implementations
- Resolve duplicate service adapters
- Connect all feature manifests
- Verify navigation
- Verify route lazy loading
- Verify settings propagation
- Verify document handoffs
- Verify converter-to-editor handoff
- Verify OCR/import-to-editor handoff
- Verify translator-to-editor handoff
- Verify font selection propagation
- Verify plan entitlements
- Verify guest document limits
- Verify local storage migrations
- Verify error boundaries
- Verify unsupported-service states

UI CONSISTENCY

Standardise:

- Header
- Navigation
- Language colours
- Buttons
- Tabs
- Segmented controls
- Forms
- Empty states
- Error states
- Loading states
- Toolbars
- Document titles
- Storage indicators
- Upgrade notices
- Mobile navigation

Remove:

- Repeated mode labels
- Overlapping floating upgrade buttons
- Giant heroes on work pages
- Dead buttons
- Fake success states
- Duplicate settings
- Placeholder routes for features that are now completed
- Console logs and debugging UI
- Unused files and obsolete configuration duplicates

RESPONSIVE QA

Test:

- Small mobile
- Large mobile
- Tablet
- Laptop
- Large desktop

Editors and converters must remain usable with on-screen keyboards.

ACCESSIBILITY

Audit:

- Keyboard navigation
- Focus visibility
- Form labels
- Tab semantics
- Dialog focus trapping
- Colour contrast
- Screen-reader status announcements
- Reduced-motion support
- Error identification

UNICODE QA

Test real examples for:

- Sinhala
- Tamil
- Devanagari
- English inside native-language text
- Combining characters
- Cursor movement
- Backspace
- Selection
- Copy/paste
- Undo/redo
- Long documents
- Language switching

PERFORMANCE

Measure and improve:

- Initial route loading
- Typing latency
- Long-document editing
- Autosave frequency
- Converter rerenders
- Bundle splitting
- Heavy OCR/editor dependencies
- Memory cleanup
- Worker termination

Ensure typing remains responsive.

SECURITY AND PRIVACY

Audit:

- Environment variables
- API-key exposure
- File validation
- HTML sanitisation
- Export sanitisation
- Local storage
- Temporary OCR/voice files
- External-provider notices
- User-content logging
- Dependency vulnerabilities where available

SEO AND DOMAIN PREPARATION

Prepare:

- language.csbodima.lk metadata
- Page titles
- Descriptions
- Open Graph foundation
- Favicon/app icons
- Robots configuration as appropriate
- Sitemap foundation for public pages
- Canonical URL configuration

TESTING

Run:

- Unit tests
- Component tests
- Integration tests
- Existing end-to-end tests
- Lint
- Type checking
- Production build

Add critical end-to-end coverage for:

1. General conversion
2. Language switching
3. Smart/phonetic switching
4. Copy Unicode
5. Save three guest documents
6. Storage-limit handling
7. Open saved document
8. Collective multilingual document
9. Font conversion
10. Editor save/export
11. Unconfigured provider handling

DOCUMENTATION

Update:

- README
- Architecture documents
- Environment-variable example
- Feature status
- Supported languages
- Supported exports
- Supported font mappings
- Provider setup
- Deployment instructions
- Known limitations

FINAL REPORT

Provide:

- Completed features
- Incomplete/provider-dependent features
- Supported conversions
- Supported exports
- Supported browser capabilities
- Test results
- Build result
- Performance observations
- Security/privacy observations
- Remaining release blockers
- Recommended release commit message

Do not finish until lint, type checking, tests and production build pass, except for clearly documented pre-existing failures that cannot be safely corrected.