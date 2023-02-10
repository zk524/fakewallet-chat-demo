export default async (msg) => {
  if (msg.type !== 'text') {
    return false
  }
  const data = msg.data.text
  switch (true) {
    case data.startsWith('link'):
      return 'link...'
    case data.startsWith('sign'):
      return 'sign...'
    default:
      return 'Command not found!'
  }
}
