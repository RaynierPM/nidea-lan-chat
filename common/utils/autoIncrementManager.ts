export class AutoIncrementSequence {
  private current = 1

  getNext() {
    return this.current++
  }
}