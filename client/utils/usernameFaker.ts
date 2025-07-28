import usernames from './usernames.json'

export abstract class FakeUsernameUtil {
  static generate() {
    const randomIndex = this.randomNumber(usernames.length)
    return usernames[randomIndex]
  }
  
  static generateRandomCharacters() {
    const length = this.randomNumber() + 3
    return Array.from({length}, () => this.randomCharacter()).join('')
  }

  private static randomNumber(number: number = 10) {
    return Math.floor(Math.random()*number)
  }

  private static randomCharacter() {
    return String.fromCharCode(64 + this.randomNumber(26))
  }
}