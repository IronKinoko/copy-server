import { read, readSync } from 'clipboardy'

export function watchClipboard(cb) {
  let prev = readSync()
  let timeID = setInterval(async () => {
    const data = await read()
    if (data !== prev) {
      prev = data
      cb(data)
    }
  }, 100)

  return {
    dispose: () => {
      clearInterval(timeID)
    },
    setClipboard: (data) => {
      prev = data
    },
  }
}
