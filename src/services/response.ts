type ErrorResult<T> = {
  code: number;
  message: string;
  data: T;
  name: string;
};

export type ErrorResponse<T> = {
  result: null;
  error: ErrorResult<T>;
  id: null;
  principal: string;
  version: string;
};

export type ValidResponse<T> = {
  result: T;
  error: null;
  id: null;
  principal: string;
  version: string;
};

type ValidBatch<T> = {
  error: null;
  result: T;
  truncated: boolean;
  summary?: string;
};

type ErrorBatch = {
  error: string;
  error_code: number;
  error_kw: {
    reason: string;
  };
  error_name: string;
};

type RequestBatch = {
  requests: Request[];
};

type RequestBatchResponse = {
  responses: Response[];
};