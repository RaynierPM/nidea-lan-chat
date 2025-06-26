import { Socket } from "net";

export type TCPSocketListener = (socket: Socket) => void