export class ArusError extends Error {
  code: string;
  status?: number;
  data?: unknown;

  constructor(message: string, code: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ArusError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}