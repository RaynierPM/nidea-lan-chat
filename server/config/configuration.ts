import { getEenv } from "../../common/utils";
import { DEFAULT_EXPOSE_PORT, DEFAULT_PORT } from "../utils/constants";
import { ConfiguratioType } from "./type";

export const configuration: ConfiguratioType = {
  port: Number(getEenv('PORT')) || DEFAULT_PORT,
  exposePort: Number(getEenv('EXPOSE_PORT')) || DEFAULT_EXPOSE_PORT,
}