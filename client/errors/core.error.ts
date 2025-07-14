export class ValidationError extends Error {
  constructor(error: string) {
    super(error?.trim() || "Unknown error")
  }
}