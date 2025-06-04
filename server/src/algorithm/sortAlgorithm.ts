import { Note } from '../types';

// This class helps sort notes by name, date, or multiple properties
export class SortAlgorithm {
  // -------------------------------
  // Sort notes by their name (A-Z or Z-A)
  // -------------------------------
  public static sortByName(notes: Note[], order: 'asc' | 'desc'): Note[] {
    if (!Array.isArray(notes) || !order) {
      return [];
    }

    // Merge Sort: A fast and stable sorting algorithm
    function mergeSort(arr: Note[]): Note[] {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = mergeSort(arr.slice(0, mid));
      const right = mergeSort(arr.slice(mid));

      return merge(left, right);
    }

    // Merge two sorted arrays into one sorted array
    function merge(left: Note[], right: Note[]): Note[] {
      const result: Note[] = [];
      let i = 0, j = 0;

      while (i < left.length && j < right.length) {
        const nameA = left[i]?.name || '';
        const nameB = right[j]?.name || '';
        const compare = nameA.localeCompare(nameB); // alphabetic comparison

        const shouldTakeLeft = order === 'asc' ? compare <= 0 : compare >= 0;

        if (shouldTakeLeft) {
          result.push(left[i++]);
        } else {
          result.push(right[j++]);
        }
      }

      // Add remaining items
      return result.concat(left.slice(i)).concat(right.slice(j));
    }

    // Use merge sort on a copy of the notes
    return mergeSort([...notes]);
  }

  // -------------------------------
  // Sort notes by their date
  // -------------------------------
  public static sortByDate(notes: Note[], order: 'asc' | 'desc'): Note[] {
    if (!Array.isArray(notes) || !order) {
      return [];
    }

    function mergeSort(arr: Note[]): Note[] {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = mergeSort(arr.slice(0, mid));
      const right = mergeSort(arr.slice(mid));

      return merge(left, right);
    }

    function merge(left: Note[], right: Note[]): Note[] {
      const result: Note[] = [];
      let i = 0, j = 0;

      while (i < left.length && j < right.length) {
        // Convert string dates into timestamps (milliseconds)
        const dateA = new Date(left[i]?.date || '').getTime();
        const dateB = new Date(right[j]?.date || '').getTime();

        const shouldTakeLeft = order === 'asc' ? dateA <= dateB : dateA >= dateB;

        if (shouldTakeLeft) {
          result.push(left[i++]);
        } else {
          result.push(right[j++]);
        }
      }

      return result.concat(left.slice(i)).concat(right.slice(j));
    }

    return mergeSort([...notes]);
  }


}
