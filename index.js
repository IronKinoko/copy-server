const clipboard = require('clipboardy')
const express = require('express')
const parser = require('body-parser')
const app = express()

app.use(parser.json())
app.use(parser.urlencoded())

const PORT = process.env.PORT || 5555

app.get('/copy', (req, res) => {
  try {
    res.json(clipboard.readSync())
  } catch {
    res.sendStatus(200)
  }
})

app.post('/paste', (req, res) => {
  clipboard.writeSync(req.body.data)
  res.send(req.body)
})

app.listen(PORT, () =>
  console.log(`sever run in http://localhost:${PORT} ${new Date().toString()}`)
)
