import {app, Menu, MenuItem } from 'electron/main'
import { loadHandlers } from './handler'
import { configureTray, createWindow } from './global.functions'

app.setAppUserModelId("com.nidea.chat")

app.whenReady()
.then(() => {
  loadHandlers()
  createWindow()
  configureTray()
})

app.on("window-all-closed", () => {})

const menu = new Menu()
menu.append(new MenuItem({
  toolTip: "Quit this super menu",
  id: "quit-button",
  label: "Quit",
  click() {
    app.quit()
  }
}))
Menu.setApplicationMenu(menu)