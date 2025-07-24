import readline from 'node:readline'
import { App } from ".";
import { configuration } from '../server/config/configuration';
import { getStatusText } from './utils/userStatus';
import { printMany } from './utils/cli';
import { lanChatReadme } from './cli-text';
import { styleText } from 'node:util';
import { ConnectionInfo } from '../common/interfaces/Chat.interface';
import { FakeUsernameUtil } from './utils/usernameFaker';
import { MessageI } from '../common/interfaces/message.interface';
import { TimestampUtils } from '../common/utils/timestamp';
import { Event, EventActionTypes } from '../common/interfaces/event.interface';
import { MessageEventPayload } from '../common/lib/Event/variants/MessageEvent';

// App ~~ ON USE ~~
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let app: App;

function printRoomNav() {
  console.log(`${styleText(['bgGreen', 'black', 'bold'], 'Room:')} ${app!.chatInfo?.roomName || "No defined"}`+
    ` -> ${styleText(['bgWhite', 'black', 'bold'], 'Chat:')} ${app!.chatInfo?.name || "No defined"}`)
}

export function printMessage(message: MessageI) {
  const isMe = message.userId === app.user.id
  const username = !message.userId
    ? "System" : isMe 
    ? "Me" : app.getParticipant(message.userId)?.username || "Unknown"

  const isToday = TimestampUtils.isToday(message.timestamp)
  const dateString = isToday
    ? TimestampUtils.getTimeFrom(message.timestamp) 
    : TimestampUtils.getStringDateFrom(Number(message.timestamp))
  console.log(`${styleText('blueBright', `${isMe? "--" : "**"}${username}`)}: ${message.content} ${styleText('gray', `~~${dateString}~~`)}`)
}

function printParty() {
  console.clear()
  const participantsList = getParticipantsList()
  printRoomNav()
  console.log(` + =========== Party =========== + ${participantsList}`)
}

function printHelp() {
  console.clear()
  printRoomNav()
  console.log(lanChatReadme)
}

function printHistory() {
  console.clear()
  printRoomNav()
  console.log(` + =========== History =========== + `)
  app?.messages?.forEach(msg => printMessage(msg))
}

function isMyEvent(event:Event) {
  return event.authorId && event.authorId === app.user.id
}

function handleCommands(entry: string) {
  const actions = entry.trim().toLowerCase().split(" ")
  const command = actions[0]
  const args = actions.slice(1)

  switch (command) {
    case "party":
      printParty()
      break;
    case "exit":
      console.log("Goodbye!!")
      process.exit(0)
    case "clear":
      console.clear()
      break;
    case "history":
      printHistory()
      break;
    case "leave":
      let roomId = !isNaN(Number(args[0]))? Number(args[0]) : app.chatInfo!.id 
      app.abandonRoom(roomId)
      break;
    case "help":
      printHelp()
      break;
    default:
      console.log(" === Unknown command === ")
      break;
  }
}

function printRooms(rooms: ConnectionInfo[]) {
  rooms.forEach((connInfo, idx) => {
    console.log(`${idx+1} → ${styleText(['blackBright'], `[`)}` + 
      `${styleText('cyan', connInfo.room.name)}${styleText('blackBright', ']')} ` + 
      styleText(['blackBright'], '(') + 
      `${styleText('green', "Owner")}: ${connInfo.room.user.username}` +
      styleText(['blackBright'], ')') +
      `${connInfo.room.withPassword? styleText('gray', ' ~~with-password~~') : ""}`
    )
  })
}

function getParticipantsList() {
  return app!.participants
    ?.map((part, idx) => {
      const isOwner = app.chatInfo?.owner.id === part.id
      return `\n #${idx+1}→ ${styleText(app.user.id === part.id? 'cyanBright' : 'reset', part.username)}`
      + ` ${styleText('gray', '(')}${getStatusText(part.status)}${styleText('gray', ')')}` 
      + ` ${isOwner? styleText('red', '~~Owner~~') : ''}`   
    }).join('')
}

let publicRooms:ConnectionInfo[] = []

async function startApp() {
  let resolver: () => void
  let promise = new Promise<void>(res => resolver = res)
  
  rl.question("Insert a username (If empty name you will have a random characters)-> ", name => {
    if (!name) name = FakeUsernameUtil.generate()
    app = new App(name, "Just testing")
    app.on(EventActionTypes.GET_HISTORY, () => {
      printHelp()
    })
    app.on(EventActionTypes.MESSAGE, (event) => {
      const messagePayload = event.payload as MessageEventPayload
      if (isMyEvent(event)) {
        printHistory()
      }else {
        printMessage({
          content: messagePayload.content,
          timestamp: event.timestamp,
          userId: event.authorId ?? null
        })
      }
    })
    console.log(`Hi, ${styleText('redBright', name)}.`)
    console.log("Scanning rooms...")
    app.searchRooms().then((rooms) => {
      publicRooms = rooms
      console.log("\nScanning finished!")
      if (publicRooms.length) {
        printRooms(publicRooms)
      } else {
        console.log("\nOh no! There aren't public rooms in your network. 🥲")
      }
      resolver?.()
    })
  })
  return promise
}

async function requestConnection() {
  let resolver: () => void
  let promise = new Promise<void>(res => resolver = res)
  
  console.log(`
${printMany("=", 80)}
How to connect to a room.

→ ${styleText(['red'], 'Enter')} the ${styleText(['redBright'], 'number')} of a room to join from the list.
→ ${styleText(['red'], 'Or')} enter a full address manually (e.g., ${styleText(["redBright"], "192.168.0.100")} or ${styleText(["redBright"], "192.168.0.100:4567")}).
→ ${styleText(['red'], 'Leave')} it empty to try connecting to localhost ${styleText(['greenBright'], "(if you're hosting a room)")}.

${styleText(['gray', 'italic'], `Notes:
- If no port is provided, the default (${configuration.port}) will be used.`)}
${printMany("=", 80)}
`)

  rl.question("->", connString => {
    if (Number(connString)) {
      const selectedRoom = publicRooms[Number(connString)-1]
      if (selectedRoom) {
        connString = `${selectedRoom.addr}:${selectedRoom.port}`
      } else {
        console.log(styleText("red", "Not valid option: closing app..."))
        return rl.close()
      }
    }
    if (!connString) {
      connString = 'localhost'
    }
    const [addr, port] = connString.split(':')
    rl.question("Insert passord (Empty if there is not required):", password => {
      console.log("Connecting...")
      app.connectToServer(
        addr, 
        Number(port) || configuration.port, 
        password
      ).then(() => resolver?.())
    })
  })
  return promise
}

startApp()
.then(() => {
  requestConnection()
  .then(() => {
    rl.on("line", (input) => {
      if (!input) return 
      const isCommand = input.startsWith('/')
      if (isCommand) handleCommands(input.substring(1))
      else app.sendMessage(input)
    })
    
    rl.on("close", () => {
      console.log("Good bye!!")
      process.exit(0)
    })
  })
})