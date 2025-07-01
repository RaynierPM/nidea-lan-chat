import { Socket } from "net";
import { ActionI } from "../chat/Action/Action.interface";

export type TCPSocketListener = (socket: Socket, action: ActionI) => void

export type SocketWithId = Socket & {_id: number}