export default async (msg) => {
  if (msg.type !== 'text') {
    return false
  }
  const cache = {}
  const data = msg.data.text

  switch (true) {
    case data.startsWith('link'):
      return 'link...'
    case data.startsWith('sign'):
      return 'sign...'
    case data.startsWith('add'):
      cache.wallet = data.split(' ').slice(-1)[0]
      return `add wallet ${cache.wallet}`
    case data.startsWith('del'):
      return 'del...'

    default:
      return 'Command not found!'
  }
}
