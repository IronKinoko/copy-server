import { read, readSync } from 'clipboardy'

export function watchClipboard(cb) {
  let prev = readSync()
  let timeId
  function run() {
    timeId = setTimeout(async () => {
      const data = await read()
      if (data !== prev) {
        prev = data
        cb(data)
      }
      run()
    }, 100)
  }

  run()

  return {
    dispose: () => {
      clearInterval(timeId)
    },
    setClipboard: (data) => {
      prev = data
    },
  }
}
