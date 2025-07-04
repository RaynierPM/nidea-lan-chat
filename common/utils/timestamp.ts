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
    return this.getDateFrom(timestamp).toLocaleTimeString()
  }

  static isToday(date: Date | number) {
    if (typeof date === 'number') {
      date = this.getDateFrom(date)
    }

    const today = new Date()

    return today.setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)
  }
}