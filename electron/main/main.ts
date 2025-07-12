import {app, BrowserWindow} from 'electron'
import {join, resolve} from 'node:path'
import {is} from '@electron-toolkit/utils'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: resolve(__dirname, '../preload/main.mjs'),
      sandbox: false,
      contextIsolation: true,
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
}

app.whenReady()
  .then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})