export enum EventTypes {
  JOIN,
  MESSAGE,
  EXIT,
  EXPULSE,
  JOINED,
}

export type JoinEventOpts = {
  id: string
  username: string
  address: string
}