export interface ApiResponse<T> {
  data: T | null;
  errorMessage: string[] | null;
} 

export interface ApiEmptyResponse {
  errorMessage: string[] | null;
}