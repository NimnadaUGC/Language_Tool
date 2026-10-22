const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Singlish package uses the shared prefix-trie matcher', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/sinhala-input.js'), 'utf8');
  assert.match(source, /compilePrefixTrie/);
  assert.match(source, /findLongestMatch/);
  assert.match(source, /Shared_Lexer\/lexer\.js/);
  assert.doesNotMatch(source, /Math\.min\(5,/);
});
