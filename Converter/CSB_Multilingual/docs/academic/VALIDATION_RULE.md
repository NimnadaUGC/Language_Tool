# Rule-Catalogue and Language-Review Validation Protocol

## Purpose

This protocol separates two different kinds of evidence:

1. **Automated rule-catalogue verification** proves that the lexer selects and
   renders every declared mapping rule exactly as it is stored in the project's
   canonical catalogue.
2. **Language-quality review** assesses whether representative conversions are
   appropriate for normal Tamil and Hindi writing. This requires review by a
   proficient human reader for a final linguistic claim.

The two forms of evidence must never be conflated. An automated pass proves
implementation consistency; it does not prove that every catalogue entry is
linguistically preferred in every context.

## Current automated rule-catalogue check

`src/engine/lexer.test.ts` scans every declared rule as its own input and
checks all of the following:

- the Unicode output is exactly the rule's stored Unicode rendering;
- one mapping token is emitted; and
- the token reports the expected stable rule identifier.

Current catalogue sizes are:

| Catalogue | Declared rules | Automated treatment |
|---|---:|---|
| Singlish | 1,486 | Every rule is scanned individually. |
| Tanglish | 1,738 | Every rule is scanned individually. |
| Hinglish | 2,902 | Every rule is scanned individually. |
| **Total** | **6,126** | **Every declared mapping is checked.** |

Run the complete application validation from `Converter/CSB_Multilingual`:

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

The lexical tests also cover 25 common phrases per language, maximal-munch
traces, literal spans, preserved unknown input, Unicode NFC normalization,
mixed writing, and representative legacy-output behaviour.

## AI-assisted draft review

An AI assistant may help prepare a review sheet by proposing representative
cases, grouping them by vowel form or cluster, and comparing the application's
output against a supplied reference target. Such observations must be labelled
**AI-assisted preliminary review**.

AI-assisted review may record a case as one of:

| Status | Meaning |
|---|---|
| `MATCHES_REFERENCE` | The generated output exactly matches the supplied target string. |
| `NEEDS_HUMAN_REVIEW` | The output is structurally plausible, but orthography, word choice, or context needs a proficient reader. |
| `MISMATCH` | The output differs from the supplied target and needs a mapping investigation. |

It must not be described as a fluent-reader assessment, native-speaker review,
or language-accuracy percentage. Do not calculate a linguistic accuracy score
from AI-assisted observations.

## Optional human-reader review

Before making a claim about natural-language quality, ask a proficient reader
of the target language to assess at least 30 examples per language. Include:

- common words and short conversational phrases;
- consonant clusters and vowel variants;
- punctuation, protected literal spans, and unknown input; and
- at least five mixed-language examples.

For each case, record the Romanized source, application output, expected target
text, verdict, reviewer initials, date, and correction notes. Keep automated,
AI-assisted, and human results in separate columns.

Suggested final-review summary:

| Language | Examples reviewed | Correct | Needs correction | Reviewer initials | Date |
|---|---:|---:|---:|---|---|
| Tamil | 30 |  |  |  |  |
| Hindi | 30 |  |  |  |  |

## Evidence handling

- Preserve the terminal output of successful test and Flex runs.
- Capture the application source, Unicode output, and Analyzer trace together
  for representative screenshots.
- Keep reviewer-provided corrections as appendices or a versioned review log.
- Update the report only with observed outcomes; do not fill a reviewer name,
  score, or verdict until it has actually been obtained.
