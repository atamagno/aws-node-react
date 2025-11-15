export const LoadingStatus = {
  loaded: "Loaded",
  loading: "Loading...",
  error: "Error",
} as const;

export type LoadingStatus = (typeof LoadingStatus)[keyof typeof LoadingStatus];
