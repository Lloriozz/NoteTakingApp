import { Note } from '../types';

export class SearchAlgorithm {
  private static containsSubstring(text: string, pattern: string): boolean {
    const t = text.toLowerCase();
    const p = pattern.toLowerCase();

    for (let i = 0; i <= t.length - p.length; i++) {
      let match = true;
      for (let j = 0; j < p.length; j++) {
        if (t[i + j] !== p[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }

    return false;
  }

  private static startsWith(text: string, prefix: string): boolean {
    if (prefix.length > text.length) return false;
    for (let i = 0; i < prefix.length; i++) {
      if (text[i] !== prefix[i]) return false;
    }
    return true;
  }

  public static searchByName(notes: Note[], searchTerm: string): Note[] {
    const results: Note[] = [];
    for (let i = 0; i < notes.length; i++) {
      if (this.containsSubstring(notes[i].name, searchTerm)) {
        results.push(notes[i]);
      }
    }
    return results;
  }

  public static searchByContent(notes: Note[], searchTerm: string): Note[] {
    const results: Note[] = [];
    for (let i = 0; i < notes.length; i++) {
      if (this.containsSubstring(notes[i].content, searchTerm)) {
        results.push(notes[i]);
      }
    }
    return results;
  }

  public static searchByDate(notes: Note[], date: string): Note[] {
    const results: Note[] = [];
    for (let i = 0; i < notes.length; i++) {
      if (this.startsWith(notes[i].date, date)) {
        results.push(notes[i]);
      }
    }
    return results;
  }
}
