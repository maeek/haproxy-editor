/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export interface ErrorMessage {
  code: number;
  error: string
}

export const prepareErrorMessageJson = (error: any, code?: number): ErrorMessage => {
  const message = error?.message ? error.message : error?.error || error;

  return {
    code: code || 400,
    error: message
  };
};
