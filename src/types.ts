// Define the Note type interface
export interface Note {
  id: string;
  name: string;
  content: string;
  date: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}