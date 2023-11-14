import { read, readSync } from 'clipboardy'

export function watchClipboard(cb) {
  let prev = readSync()
  let taskId = 0
  let timeId
  function run() {
    timeId = setTimeout(async () => {
      const _taskId = ++taskId
      const data = await read()
      if (_taskId === taskId) {
        if (data !== prev) {
          prev = data
          cb(data)
        }
      }
      run()
    }, 100)
  }

  run()

  return {
    dispose: () => {
      clearTimeout(timeId)
    },
    setClipboard: (data) => {
      taskId++
      prev = data
    },
  }
}
