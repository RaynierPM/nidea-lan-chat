import '@electron-toolkit'
declare global {
  interface Window {
    core: {
      ping: () => void
    }
  }
}
