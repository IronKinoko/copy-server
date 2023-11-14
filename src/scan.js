import os from 'node:os'
import client from 'socket.io-client'

const checkPort = (ip, port) => {
  return new Promise((resolve) => {
    const socket = client(`http://${ip}:${port}`)
    socket.on('hello', () => {
      resolve(true)
      socket.close()
    })
    socket.on('error', () => {
      socket.close()
      resolve(false)
    })

    setTimeout(() => {
      socket.close()
      resolve(false)
    }, 100)
  })
}

const checkAllIps = async (subnet, port) => {
  let ips = []
  for (let i = 1; i <= 255; i++) {
    const ip = `${subnet}.${i}`
    const isOpen = await checkPort(ip, port)
    if (isOpen) ips.push(ip)
  }
  return ips
}

// get local ip address
const getLocalIp = () => {
  const nets = os.networkInterfaces()
  let ips = []
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address)
      }
    }
  }
  return ips
}

const scan = async (port) => {
  const ips = await Promise.all(
    getLocalIp().map(async (ip) => {
      const ips = await checkAllIps(ip.split('.').slice(0, 3).join('.'), port)
      return ips.filter((_ip) => ip !== _ip)
    })
  )
  return ips.flat()
}

export default scan
