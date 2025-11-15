export interface ApiError extends Error {
  statusCode: number;
  message: string;
  internalError?: string;
}
