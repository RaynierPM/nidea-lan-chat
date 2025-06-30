export class InvalidEventType extends Error {
  constructor(type: unknown) {
    super(type + " is not a valid type.")
  }
}