feat/typing-speed-test

Implement the comprehensive CSB multilingual Typing Speed Test.

Primarily modify:

src/features/typing-test/**
feature-specific tests

PURPOSE

Allow users to compare:

- CSB Smart Typing
- Phonetic Converter

Across:

- Singlish/Sinhala
- Tanglish/Tamil
- Hinglish/Hindi

TEST MODES

- Practice
- Timed test
- CSB Smart Typing test
- Phonetic test
- Direct comparison using the same passage
- Custom passage where appropriate

MEASUREMENTS

Calculate transparently:

- Words per minute
- Characters per minute
- Final accuracy
- Uncorrected errors
- Corrected errors
- Backspace count
- Total completion time
- Correction time where measurable
- Conversion latency where measurable
- Improvement percentage between methods

Document the formulas in the UI or help section.

FAIR COMPARISON

The comparison must:

- Use equivalent passages
- Use the same device/session where possible
- Keep passage difficulty consistent
- Avoid changing the required output between methods
- Clearly state that personal results are not a scientific general-user study

CLAIM SAFETY

Do not display “85% of users are faster” as a fact.

Create a data-driven claim component that remains hidden until real study data and methodology are configured.

Personal results may say:

“You completed this test 24% faster with CSB Smart Typing.”

GAMIFICATION

Implement:

- Personal best
- Accuracy streak
- Language badges
- Speed level
- Daily challenge foundation
- Result history
- Shareable result card
- Privacy-safe social sharing
- Optional simple speed-related character or mascot area

Do not expose the user’s typed content on the share card.

PASSAGES

Create a typed passage registry with:

- Language
- Difficulty
- Estimated length
- Source/provenance field
- Active status

Avoid copyrighted long passages.

TESTS

Test:

- Timing
- WPM/CPM formulas
- Accuracy
- Error calculation
- Comparison percentage
- Pausing/abandoning
- Result history
- Share-card privacy
- Language switching
- Smart Typing integration

Run lint, tests and production build.

Return summary, formulas, changed files, tests and recommended commit message.