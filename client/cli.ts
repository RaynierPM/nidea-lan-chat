import readline from 'node:readline'
import { App } from ".";
import { configuration } from '../server/config/configuration';
import { getStatusText } from './utils/userStatus';
import { printMany } from './utils/cli';
import { lanChatReadme } from './cli-text';

// App ~~ ON USE ~~
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let app: App;

function handleCommands(command: string) {
  command = command.trim().toLowerCase()
  switch (command) {
    case "party":
      console.clear()
      const participantsList = getParticipantsList()
      app?.printRoomName()
      console.log(` + ==== Party ==== + ${participantsList}`)
      break;
    case "exit":
      console.log("Goodbye!!")
      process.exit(0)
    case "clear":
      console.clear()
      break;
    case "history":
      console.clear()
      app?.printRoomName()
      console.log(` + ==== History ==== + `)
      app?.messages?.forEach(msg => app.printMessage(msg))
      break;
    case "help":
      console.clear()
      app.printRoomName()
      console.log(lanChatReadme)
      break;
    default:
      console.log(" === Unknown command === ")
      break;
  }
}

function getParticipantsList() {
  return app!.participants
    ?.map(part => `\n ${part.username} (${getStatusText(part.status)})`)
    .join('')
}

async function startApp() {
  let resolver: () => void
  let promise = new Promise<void>(res => resolver = res)
  
  rl.question("Insert a username (If empty you will Papotico ~~ We love papotico ~~) -> ", name => {
    if (!name) name = "Papotico"
    app = new App(name)
    app.search().then(() => {resolver?.()})
  })
  return promise
}

async function requestConnection() {
  let resolver: () => void
  let promise = new Promise<void>(res => resolver = res)
  
  console.log(`
${printMany("=", 30)}
Check the list above and insert room's address (If empty will connecto to yourself). 
(if u want to specify a port different from default {${configuration.port}} add ':')
example: 192.168.0.231:1234`)

  rl.question("->", connString => {
    if (!connString) {
      connString = 'localhost'
    }
    const [addr, port] = connString.split(':')
    app.connectToServer(addr, Number(port) || configuration.port)
    console.log("Connecting...")
    resolver?.()
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