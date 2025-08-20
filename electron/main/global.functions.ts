import { is } from "@electron-toolkit/utils"
import { app } from "electron"
import { nativeImage } from "electron/common"
import { BrowserWindow, Menu, Tray } from "electron/main"
import { join, resolve } from "path"
import { MainState } from "./main.state"

const isWindows = process.platform === "win32"
const iconPath = join(__dirname, "..", "..", "assets", isWindows? "icon.ico" : "icon.png")
export const icon = nativeImage.createFromPath(iconPath)

export function configureTray() {
  const tray = new Tray(icon)
  const menu = Menu.buildFromTemplate([
    {
      label: "Open", 
      type: "normal", 
      click() {
        createWindow()
      }
    },
    {
      label: "Quit",
      type: "normal",
      click() {
        MainState.instance.destroyWindow()
        app.quit()
      }
    }
  ])
  tray.setToolTip("Nidea Lan Chat")
  tray.setContextMenu(menu)
  tray.on("double-click", () => {
    MainState.instance.showWindow()
  })
  return tray
}

export function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon,
    webPreferences: {
      preload: resolve(__dirname, '../preload/main.mjs'),
      sandbox: false,
    },
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (!app.isPackaged) {
    win.webContents.openDevTools()
  }

  win.on("show", () => {
    win.setSkipTaskbar(false)
  })

  win.on("close", e => {
    e.preventDefault()
    win.setSkipTaskbar(true)
    win.hide()
  })

  MainState.instance.setWindow(win)
}
