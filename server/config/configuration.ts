import { getEnv } from "../../common/utils";
import { DEFAULT_EXPOSE_PORT, DEFAULT_PORT } from "../lib/utils/constants";
import { ConfiguratioType } from "./type";

export const configuration: ConfiguratioType = {
  port: Number(getEnv('PORT')) || DEFAULT_PORT,
  exposePort: Number(getEnv('EXPOSE_PORT')) || DEFAULT_EXPOSE_PORT,
  passwordSalt: getEnv('PASSWORD_SALT') || "NIDEA_SALT"
}