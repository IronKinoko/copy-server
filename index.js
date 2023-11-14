import { readSync, writeSync } from 'clipboardy'
import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import client from 'socket.io-client'
import { watchClipboard } from './src/watchClipboard.js'
import scan from './src/scan.js'

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 5555

app.get('/copy', (req, res) => {
  try {
    res.json(readSync())
  } catch {
    res.sendStatus(200)
  }
})

app.post('/paste', (req, res) => {
  writeSync(req.body.data)
  res.send(req.body)
})

io.on('connection', (socket) => {
  socket.emit('hello', 'world')
  socket.on('copy', (data) => {
    write(data)
  })
})

let sockets = []
const wc = watchClipboard((data) => {
  io.emit('copy', data)
  sockets.forEach((socket) => socket.emit('copy', data))
})

function write(data) {
  wc.setClipboard(data)
  writeSync(data)
}

for (const ip of await scan(PORT)) {
  const socket = client(`http://${ip}:${PORT}`)
  console.log(`${ip} server connect`)
  socket.on('copy', (data) => {
    write(data)
  })
  sockets.push(socket)

  socket.on('disconnect', () => {
    console.log(`${ip} server disconnect`)
    sockets = sockets.filter((_socket) => _socket !== socket)
  })
}

server.listen(PORT, () =>
  console.log(`sever run in http://localhost:${PORT} ${new Date().toString()}`)
)
