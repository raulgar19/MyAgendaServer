export interface Event {
  id: number;
  title: string;
  start_time: Date;
  location?: string;
}

export interface CreateEventDTO {
  title: string;
  start_time: string; // ISO 8601 format
  location?: string;
}

export interface UpdateEventDTO {
  title?: string;
  start_time?: string;
  location?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QueryFilters {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
