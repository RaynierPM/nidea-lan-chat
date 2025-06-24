import {networkInterfaces} from 'os'

export abstract class NetworkUtils {
  private static getNetworkInterface() {
    const interfaces = networkInterfaces()
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface
        }
      }
    }
    return null
  }

  public static getPrivateIp() {  
    return this.getNetworkInterface()?.address || null
  }

  public static getNetworkMacAddr() {
    return this.getNetworkInterface()?.mac || null
  }

}