export class TimestampUtils {
  static getDateFrom(timestamp: number) {
    return new Date(timestamp)
  }

  static getTimestampFrom(date: Date = new Date()) {
    return Number(date)
  }

  static getStringDateFrom(timestamp: number) {
    return this.getDateFrom(timestamp).toLocaleDateString()
  }

  static getTimeFrom(timestamp: number) {
    return this.getDateFrom(timestamp).toTimeString()
  }
}