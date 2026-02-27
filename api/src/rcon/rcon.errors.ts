export class RconError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}
