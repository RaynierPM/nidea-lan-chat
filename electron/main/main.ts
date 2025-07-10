import {app, BrowserWindow} from 'electron'
import {join} from 'node:path'
import {is} from '@electron-toolkit/utils'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/main.js'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log({isDev: is.dev})
    console.log({URL: process.env['ELECTRON_RENDERER_URL']})
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    console.log({isDev: is.dev})
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(createWindow)