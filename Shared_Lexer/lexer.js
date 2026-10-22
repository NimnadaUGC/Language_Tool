// Shared, zero-dependency lexical matching core. It is deliberately DOM-free
// so the React application and each browser npm module use identical matching.

const trieCache = new WeakMap();

export function compilePrefixTrie(entries) {
  const root = { children: new Map() };
  for (const entry of entries) {
    let node = root;
    for (const character of Array.from(entry.source)) {
      let child = node.children.get(character);
      if (!child) {
        child = { children: new Map() };
        node.children.set(character, child);
      }
      node = child;
    }
    node.entry = entry;
  }
  return root;
}

export function findLongestMatch(root, characters, start) {
  let node = root;
  let matched;
  for (let index = start; node && index < characters.length; index += 1) {
    node = node.children.get(characters[index]);
    if (node?.entry) matched = node.entry;
  }
  return matched;
}

export function convertWithMaximalMunch(source, mapping) {
  let trie = trieCache.get(mapping);
  if (!trie) {
    const entries = Object.entries(mapping).map(([key, value]) => ({ source: key, value }));
    trie = compilePrefixTrie(entries);
    trieCache.set(mapping, trie);
  }
  const characters = Array.from(source);
  let result = '';
  for (let index = 0; index < characters.length;) {
    const match = findLongestMatch(trie, characters, index);
    if (match) {
      result += match.value;
      index += Array.from(match.source).length;
    } else {
      result += characters[index];
      index += 1;
    }
  }
  return result;
}
