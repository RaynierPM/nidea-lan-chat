import { EnviromentError } from "../../server/errors/Enviroment"

export function getEenv<T = string>(key: string, required: boolean = false): T {
  const value = process.env[key]
  if (required && !value) throw new EnviromentError(key) 
  return value as T
}