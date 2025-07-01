export class AutoIncrementSequence {
  private current = 1

  getNext() {
    return this.current++
  }
}

export class GlobalAutoIcrement {
  private static _instance: GlobalAutoIcrement
  private autoIncrementSequence: AutoIncrementSequence

  static getInstance() {
    if (!this._instance) {
      this._instance = new GlobalAutoIcrement()
    }
    return this._instance
  }
  
  private constructor() {
    this.autoIncrementSequence = new AutoIncrementSequence()
  }

  getNext() {
    return this.autoIncrementSequence.getNext()
  }
}