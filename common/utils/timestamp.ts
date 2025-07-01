export class TimestampUtils {
  static getDateFrom(timestamp: number) {
    return new Date(timestamp)
  }

  static getTimestampFrom(date: Date = new Date()) {
    return Number(date)
  }
}