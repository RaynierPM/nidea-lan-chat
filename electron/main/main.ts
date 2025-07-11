import {app, BrowserWindow} from 'electron'
import {join, resolve} from 'node:path'
import {is} from '@electron-toolkit/utils'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: resolve(__dirname, '../preload/main.js'),
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

  console.log(join(__dirname, '../preload/main.js'))
  debugger
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})