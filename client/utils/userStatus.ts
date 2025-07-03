import { UserStatuses } from "../../common/interfaces/User.interface";

export function getStatusText(status: UserStatuses) {
  switch (status) {
    case UserStatuses.ACTIVE:
      return "Active"
    case UserStatuses.DISCONNECTED:
      return "Disconnected"
    case UserStatuses.INACTIVE:
      return "Iddle"
    default:
      return "Unknown"
  }
}