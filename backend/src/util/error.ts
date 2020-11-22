export interface ErrorMessage {
  code: number;
  error: string
}

export const prepareErrorMessageJson = (error: any, code?: number): ErrorMessage => {
  const includesPath = error?.message
    ? (error.message.includes(process.env.CONFIG_DIR) || error.message.includes(process.env.APP_DIR))
    : false;

  let message = error?.message ? error.message : error?.error || error;

  return {
    code: code || 400,
    error: message
  }
};
