import { styleText } from "node:util";
import { printMany } from "./utils/cli";

export const lanChatReadme = `${printMany("=", 80)}
${styleText(['cyanBright', 'bold'], '   TERMINAL LAN CHAT')}
${printMany("=", 80)}

${styleText(['yellowBright', 'bold'], '💡 HOW IT WORKS:')}
- Type anything to send a message.
- Messages are shared with everyone on the LAN.
- Commands start with a slash (/).

${styleText(['magentaBright', 'bold'], '🛠️ COMMANDS:')}
${styleText(['greenBright'], '/party')}     → Show users in the room.
${styleText(['greenBright'], '/history')}   → Show message history again.
${styleText(['greenBright'], '/clear')}     → Clear the terminal screen.
${styleText(['greenBright'], '/exit')}      → Leave the chat silently.
${styleText(['greenBright'], '/Abandon')}   → Leave and notify others. ${styleText(['gray', 'italic'], '(REALLY? Nah, is not working :D)')}

${styleText(['greenBright'], '/help')}      → Show this helper message again.
`;