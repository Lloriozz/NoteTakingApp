import { Note } from '../types';

export class SortAlgorithm {
  // -----------------------
  // Sort by Name (Merge Sort)
  // -----------------------
  public static sortByName(notes: Note[], order: 'asc' | 'desc'): Note[] {
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
        const compare = left[i].name.localeCompare(right[j].name);
        const condition = order === 'asc' ? compare <= 0 : compare >= 0;
        if (condition) result.push(left[i++]);
        else result.push(right[j++]);
      }
      return result.concat(left.slice(i)).concat(right.slice(j));
    }

    return mergeSort([...notes]);
  }

  // -----------------------
  // Sort by Date (Merge Sort)
  // -----------------------
  public static sortByDate(notes: Note[], order: 'asc' | 'desc'): Note[] {
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
        const dateA = new Date(left[i].date).getTime();
        const dateB = new Date(right[j].date).getTime();
        const condition = order === 'asc' ? dateA <= dateB : dateA >= dateB;
        if (condition) result.push(left[i++]);
        else result.push(right[j++]);
      }
      return result.concat(left.slice(i)).concat(right.slice(j));
    }

    return mergeSort([...notes]); // ✅ Fixed: add missing return
  }

  // -----------------------
  // Sort by Multiple Criteria
  // -----------------------
  public static sortByMultiple(
    notes: Note[],
    criteria: Array<{ key: 'name' | 'date' | 'contentLength'; order: 'asc' | 'desc' }>
  ): Note[] {
    return [...notes].sort((a, b) => {
      for (const { key, order } of criteria) {
        let comparison = 0;
        switch (key) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'contentLength':
            comparison = a.content.length - b.content.length;
            break;
        }
        if (comparison !== 0) {
          return order === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }
}
