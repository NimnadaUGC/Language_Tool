feat/capture-center

Implement the Capture Centre for file import, OCR and voice typing.

Primarily modify:

src/features/capture/**
capture-provider adapters
feature-specific tests

Never generate fake OCR or speech-recognition output.

CAPTURE CENTRE SECTIONS

1. File import
2. Image/PDF OCR
3. Voice typing

FILE IMPORT

Support production-quality import where technically reliable:

- TXT
- Markdown
- RTF
- DOCX
- Text-based PDF
- Images for OCR

Allow the user to identify content as:

- Existing Unicode
- Singlish
- Tanglish
- Hinglish
- Legacy font encoding
- Auto detect

After import, allow:

- Preview
- Edit
- Send to General Converter
- Send to Collective Studio
- Send to Document Editor

OCR FLOW

Provide:

- File upload
- Image preview
- Rotate
- Crop foundation
- Language/script selection
- Printed-text mode
- English-letter transliteration mode
- Scan
- Side-by-side image/result view
- Confidence display
- Low-confidence word highlighting
- Manual corrections
- Send result to another workspace

Support architecture for:

- Sinhala Unicode OCR
- Tamil Unicode OCR
- Hindi Unicode OCR
- English OCR
- Singlish/Tanglish/Hinglish text written with English letters

Do not label handwriting OCR as reliable unless a configured provider genuinely supports it.

VOICE TYPING

Prepare or implement provider support for:

- Sinhala
- Tamil
- Hindi
- English

Controls:

- Start
- Pause
- Resume
- Stop
- Language selection
- Live transcript
- Interim-result indicator
- Punctuation controls
- Clear
- Send transcript to editor

Voice output should normally be Unicode. Do not unnecessarily pass native-language speech through phonetic conversion.

PRIVACY

Add:

- Clear explanation of local versus remote processing
- Temporary-file deletion controls
- Permission-denied handling
- Provider-unavailable handling
- File-size and type validation
- No hidden retention of recordings or images

PROVIDER ARCHITECTURE

Use the shared OCR and speech interfaces.

If no provider/API is configured:

- Show a clear setup-required or unavailable state.
- Keep the rest of the application usable.
- Do not return mock output in production.

TESTS

Test:

- File validation
- Import parsing
- Unsupported formats
- Provider unavailable
- OCR correction workflow
- Voice permission denial
- Language selection
- Sending output to workspaces
- Temporary-data clearing

Run lint, tests and production build.

Return supported capabilities, provider requirements, changed files, privacy notes, tests and recommended commit message.