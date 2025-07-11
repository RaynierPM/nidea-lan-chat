import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    core: {
      ping: () => void
    }
  }
}
