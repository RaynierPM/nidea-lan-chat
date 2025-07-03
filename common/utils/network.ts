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

  public static getNetworkMask() {
    return this.getNetworkInterface()?.netmask
  }

  public static getBroadcastableAddr() {
    const netMask = this.getNetworkMask()
    const splittedIpv4 = this.getPrivateIp()?.split('.')
    if (!netMask || !splittedIpv4) return 
    
    return netMask
      .split('.')
      .map((ipSection, idx) => {
        if (ipSection === '255') return splittedIpv4[idx]
        else return '255'
      })
      .join('.')
  }

}