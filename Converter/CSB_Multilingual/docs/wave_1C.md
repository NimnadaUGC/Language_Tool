feat/document-library

Implement the local-first Document Library for the CSB multilingual platform.

Follow the shared WritingDocument, DocumentBlock, DocumentMetadata, repository and entitlement contracts created by the master foundation.

Primarily modify:

src/features/library/**
document-storage implementation owned by this feature
feature-specific tests

GOAL

Provide a dependable local document system while keeping the architecture ready for future cloud sync.

FREE GUEST POLICY

Implement the configured entitlement policy for guest users:

- Maximum three locally saved documents
- Clear “0 of 3 local documents used” presentation
- Editing an existing document must not count as a new document
- Importing or duplicating into a new document must respect the limit
- Users must be able to export or delete documents before reaching the limit

Do not hardcode plan rules inside unrelated UI components. Use the shared entitlement service.

DOCUMENT OPERATIONS

Implement:

- Create
- Open
- Autosave
- Manual save
- Rename
- Duplicate
- Pin/unpin
- Search
- Filter by language
- Filter by document type
- Sort by updated date, created date and title
- Move to Trash
- Restore
- Permanently delete with confirmation
- Export
- Display local/cloud status
- Display language and strategy metadata

LOCAL STORAGE

Use an appropriate browser database mechanism for documents rather than storing large documents in simple component state.

Requirements:

- Repository abstraction
- Schema versioning
- Migration support
- Graceful handling of storage failures
- Quota/error messages
- Recovery of interrupted autosaves
- Sanitised document titles
- Stable IDs
- Created/updated timestamps
- No accidental document overwrite

LIBRARY UI

Create:

- Recent documents
- All documents
- Pinned
- Local documents
- Trash
- Search field
- Filters
- List and card views where practical
- Empty states
- Storage-limit indicator
- Upgrade notice that does not obstruct work

DOCUMENT RECOVERY

Provide:

- Unsaved recovery entry where possible
- Last autosave timestamp
- Clear conflict state for future cloud sync
- Safe handling when browser storage has been cleared

Explicitly explain that guest documents are stored locally and may be lost if browser data is removed.

Do not implement fake cloud sync.

TESTS

Test:

- Three-document limit
- Create/update/delete
- Duplicate behaviour
- Trash and restore
- Search/filter/sort
- Autosave
- Migration
- Storage failure
- Existing document updates
- Entitlement state

Run lint, tests and production build.

Return a summary, changed files, repository/storage decisions, test results and a recommended commit message.