# Flex Lexer Demonstration

This folder is an academic companion to `CSB_Multilingual`. It proves that the
same Romanized Sinhala, Tamil, and Hindi rule tables can be expressed through a
lexer generator. It does **not** replace the React application's production
TypeScript lexer.

## Relationship to the application

- `CSB_Multilingual/src/engine/lexer.ts` is the browser application's lexer.
- `generate_flex_spec.mjs` imports the exact three mapping tables used by that
  application and generates a Flex specification from them.
- The generated scanner uses Flex maximal-munch behaviour: at every input
  position, the longest matching rule is selected.
- Each match prints a token trace with its language, category, rule ID, Roman
  lexeme, and Unicode rendering. It also prints the concatenated Unicode output.

Literal spans such as `[email@example.com]`, whitespace, and unknown input are
represented explicitly in the generated scanner. Literal spans are preserved;
unknown input is retained rather than discarded.

## Run the demonstration

From this folder:

```sh
./run_demo.sh
```

The script performs the complete reproducible pipeline:

```text
Shared application mapping tables
        ↓
generate_flex_spec.mjs
        ↓
generated/{singlish,tanglish,hinglish}_lexer.l
        ↓
flex
        ↓
generated/{language}_lexer.c
        ↓
C compiler → generated/{language}_lexer
```

It then runs the scanner against the three sample files in `samples/`.

Before generating scanners, the script verifies that a compiler can both
compile and link a trivial C program. It tries `cc`, `gcc-15`, `gcc`, and
`clang` in that order, selecting the first usable compiler. This avoids a
known macOS failure mode where Command Line Tools can compile C files but the
installed SDK cannot be linked. To choose a compiler explicitly, run for
example:

```sh
CC=gcc-15 ./run_demo.sh
```

## Submission evidence

Include these items with the assignment code:

1. `generate_flex_spec.mjs` — source code that generates the Flex lexer rules.
2. `generated/{singlish,tanglish,hinglish}_lexer.l` — generated Flex input specifications.
3. `run_demo.sh` and the terminal output — reproducible Flex-generation and
   execution evidence.
4. The React application's Mapping view — evidence of the same underlying rule
   catalogue, token categories, greedy matching explanation, and Unicode output.

The generated `.c` file and executable are build products, so they are created
by the script rather than maintained as handwritten source.
