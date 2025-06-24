import { UserI } from "./User.interface";

export interface EventCommand {
  execute<T>(): T
}