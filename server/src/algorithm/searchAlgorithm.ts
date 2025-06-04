// SearchAlgorithm.ts
import { Note } from '../types';

// TrieNode class for prefix matching
class TrieNode {
  children: Map<string, TrieNode>;
  notes: Note[];
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.notes = [];
    this.isEndOfWord = false;
  }
}

// Trie class to search by name
class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // Insert a note name into the trie
  insert(note: Note): void {
    let node = this.root;
    const name = note.name.toLowerCase();

    for (const char of name) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEndOfWord = true;
    node.notes.push(note);
  }

  // Search for notes by prefix
  search(prefix: string): Note[] {
    let node = this.root;
    prefix = prefix.toLowerCase();

    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }

    // Collect all notes from this point forward
    const result: Note[] = [];
    this.collectNotes(node, result);
    return result;
  }

  private collectNotes(node: TrieNode, result: Note[]): void {
    if (node.isEndOfWord) {
      result.push(...node.notes);
    }
    for (const child of node.children.values()) {
      this.collectNotes(child, result);
    }
  }
}

// Inverted index for content-based searching
class InvertedIndex {
  private index: Map<string, Note[]>;

  constructor() {
    this.index = new Map();
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
  }

  build(notes: Note[]): void {
    for (const note of notes) {
      const words = this.tokenize(note.content);
      for (const word of words) {
        if (!this.index.has(word)) {
          this.index.set(word, []);
        }
        const noteList = this.index.get(word)!;
        if (!noteList.includes(note)) {
          noteList.push(note);
        }
      }
    }
  }

  search(word: string): Note[] {
    return this.index.get(word.toLowerCase()) || [];
  }
}

// Unified search class
export class SearchAlgorithm {
  private trie: Trie;
  private invertedIndex: InvertedIndex;

  constructor(notes: Note[]) {
    this.trie = new Trie();
    this.invertedIndex = new InvertedIndex();

    for (const note of notes) {
      this.trie.insert(note);
    }

    this.invertedIndex.build(notes);
  }

  public searchByName(term: string): Note[] {
    return this.trie.search(term);
  }

  public searchByContent(term: string): Note[] {
    return this.invertedIndex.search(term);
  }

  public searchByDate(notes: Note[], date: string): Note[] {
    return notes.filter(note => note.date.startsWith(date));
  }
}
