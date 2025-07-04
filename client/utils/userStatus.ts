import { styleText } from "util";
import { UserStatuses } from "../../common/interfaces/User.interface";

export function getStatusText(status: UserStatuses) {
  switch (status) {
    case UserStatuses.ACTIVE:
      return styleText("greenBright", "Active")
    case UserStatuses.DISCONNECTED:
      return styleText("blackBright", "Disconnected")
    case UserStatuses.INACTIVE:
      return styleText("yellow", "Iddle")
    default:
      return "Unknown"
  }
}