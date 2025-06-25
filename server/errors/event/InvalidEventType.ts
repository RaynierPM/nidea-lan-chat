export class InvalidaEventType extends Error {
  constructor(type: number) {
    super(type + " is not a valid type.")
  }
}