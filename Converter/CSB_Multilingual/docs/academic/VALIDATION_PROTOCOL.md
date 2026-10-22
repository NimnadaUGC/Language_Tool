# Assignment 2 validation protocol

## Automated evidence

Run the following in the application folder before recording results:

```text
npm run typecheck
npm run lint
npm test
npm run build
```

The automated suite includes at least 75 declared lexical rules per language, a 25-item phrase corpus per language, maximal-munch traces, literal spans, unknown-input diagnostics, Unicode normalization, and representative legacy-font cases.

## Fluent-reader review log

Do not write an accuracy percentage until this table is completed by actual reviewers.

| Language | Reviewer initials | Review date | Examples reviewed | Correct | Needs correction | Notes |
|---|---:|---|---:|---:|---:|---|
| Tamil |  |  | 30 |  |  |  |
| Hindi |  |  | 30 |  |  |  |

Use normal conversational words, clusters, vowel variants, punctuation, literal spans, and at least five mixed-language cases. Record the source text, produced Unicode, reviewer verdict, and any corrected target text in the report appendix.

## Demonstration evidence

Capture one screenshot for each language showing the source, Unicode result, visible analyzer trace, and an intentional diagnostic. Capture one additional screenshot for each legacy export. The report must distinguish the lexical Unicode stage from the optional legacy-font stage.
