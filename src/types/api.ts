export type CallResult<T> = {
  errors: any[];
  message: string | null;
  success: boolean;
  d: T;
};
