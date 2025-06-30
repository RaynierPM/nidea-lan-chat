export class AutoIncrementSequence {
  private current = 1

  getNext() {
    return this.current++
  }
}

export class GlobalAutoIcrement {
  private static _instance: GlobalAutoIcrement

  private current: number = 1
  private autoIncrementSequence: AutoIncrementSequence

  static getInstance() {
    let instance = this._instance
    if (!instance) {
      this._instance = new GlobalAutoIcrement()
    }
    return instance
  }
  
  private constructor() {
    this.autoIncrementSequence = new AutoIncrementSequence()
  }

  getNext() {
    return this.autoIncrementSequence.getNext()
  }
}