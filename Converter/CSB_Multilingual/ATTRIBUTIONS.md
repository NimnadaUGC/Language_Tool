# Sources, attribution, and implementation limits

## Original supplied work

The Singlish, Tanglish, and Hinglish phonetic rule tables were supplied in this assignment workspace as the author's existing npm modules. The academic application now consumes those rules through one shared lexical-analysis layer rather than maintaining separate copies.

`fm_abhaya_to_unicode.py` was also supplied with the assignment material. The application imports that file as a read-only mapping source for its FM Abhaya Unicode-to-legacy inverse map. Before public release, confirm the provenance and redistribution terms of the supplied table.

## Standards and reference material

- [Unicode Script Charts](https://www.unicode.org/charts/script/index_list.html) define the Sinhala, Tamil, and Devanagari character repertoires used for Unicode output validation.
- [Unicode Standard, Tamil syllable table](https://www.unicode.org/versions/Unicode17.0.0/UnicodeStandard-17.0.pdf) documents the base-letter and vowel-sign structure used by the Tamil renderer.
- [Sinhala transliteration research](https://aclanthology.org/2025.indonlp-1.19.pdf) is cited in the later report to position this tool as an explainable rule-based system rather than a neural transliteration model.

## Legacy-font targets

- **FM Abhaya:** generated from the supplied local FM Abhaya mapping source.
- **Bamini:** a conservative browser implementation of common base-letter and vowel-positioning rules. It was independently written after consulting publicly documented Bamini conversion behaviour, including the target coverage described by [Open-Tamil](https://github.com/Ezhil-Language-Foundation/open-tamil/blob/main/tamil/txt2unicode/README.md). No Open-Tamil source code or data is bundled.
- **Kruti Dev 010:** a conservative browser implementation for common Devanagari characters, `i`-matra order, and simple reph handling. Its target behaviour was checked against the documented examples in this [Kruti Dev converter project](https://github.com/Parikshit127/kurti-dev-converter). No code from that project is bundled.

Legacy output is intentionally diagnostic-first: unsupported or unsafe mappings remain visible and produce a warning. It must not be described as complete archival conversion until a fluent reviewer validates the complete target-font corpus.
