export class EnviromentError extends Error {
  constructor(key: string) {
    super(`Enviroment: ${key} not founded`)
  }
}