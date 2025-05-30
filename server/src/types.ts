export interface Note {
  id: string;
  name: string;
  content: string;
  date: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SearchParams {
  name?: string;
  content?: string;
}


export interface SortParams {
  key: 'name' | 'date';
  order: 'asc' | 'desc';
}
