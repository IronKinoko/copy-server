import { read } from 'clipboardy'
export function watchClipboard(cb) {
  let prev
  let timeID = setInterval(async () => {
    const data = await read()
    if (prev === undefined) {
      prev = data
      return
    }

    if (data !== prev) {
      prev = data
      cb(data)
    }
  }, 100)

  return () => {
    clearInterval(timeID)
  }
}
