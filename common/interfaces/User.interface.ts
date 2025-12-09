export interface UserI {
  id: string
  username: string
}

export enum UserStatuses {
  ACTIVE,
  INACTIVE,
  DISCONNECTED,
  TYPING,
}