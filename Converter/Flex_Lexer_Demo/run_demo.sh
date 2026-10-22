#!/usr/bin/env sh
set -eu

demo_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
generated_dir="$demo_dir/generated"

command -v node >/dev/null 2>&1 || { echo "Node.js is required to generate the Flex specification." >&2; exit 1; }
command -v flex >/dev/null 2>&1 || { echo "Flex is required. Install it, then run this script again." >&2; exit 1; }

# Prefer the standard compiler, but verify that it can link a trivial program.
# This matters on macOS when Command Line Tools and the installed SDK are out
# of sync: clang can compile scanner objects but cannot link them.  A caller
# can select a particular compiler with CC=/path/to/compiler.
compiler_probe_dir=$(mktemp -d "${TMPDIR:-/tmp}/csb-flex-compiler.XXXXXX")
trap 'rm -rf -- "$compiler_probe_dir"' EXIT HUP INT TERM

if [ -n "${CC:-}" ]; then
  compiler_candidates=$CC
else
  compiler_candidates='cc gcc-15 gcc clang'
fi

compiler=''
for candidate in $compiler_candidates; do
  candidate_path=$(command -v "$candidate" 2>/dev/null || true)
  [ -n "$candidate_path" ] || continue
  if printf 'int main(void) { return 0; }\n' | "$candidate_path" -x c -o "$compiler_probe_dir/probe" - >/dev/null 2>&1; then
    compiler=$candidate_path
    break
  fi
done

[ -n "$compiler" ] || {
  echo "No usable C compiler was found. Set CC to a compiler that can compile and link a C program." >&2
  exit 1
}

echo "Using C compiler: $compiler"

node "$demo_dir/generate_flex_spec.mjs"

for language in singlish tanglish hinglish; do
  echo "\n=== $language ==="
  flex -o "$generated_dir/${language}_lexer.c" "$generated_dir/${language}_lexer.l"
  "$compiler" -std=c11 -O2 "$generated_dir/${language}_lexer.c" -o "$generated_dir/${language}_lexer"
  "$generated_dir/${language}_lexer" < "$demo_dir/samples/$language.txt"
done
