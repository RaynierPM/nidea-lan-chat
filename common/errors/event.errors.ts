export class NotValidEventPayload extends Error {
  errors?: Record<string, string>
  constructor(errors: Record<string, string>) {
    super("This payload not satisfy the requirements")
    this.errors = errors
  }
}