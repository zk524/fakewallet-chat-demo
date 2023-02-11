import { updateaccounts, initWalletConnect } from '@/controllers/wallet'

export default async (msg) => {
  if (msg.type !== 'text') {
    return false
  }

  const cache = {}
  const data = msg.data.text

  switch (true) {
    case data.startsWith('link'):
      return (
        <a href="https://baidu.com" target="_blank">
          test
        </a>
      )

    case data.startsWith('sign'):
      return 'sign...'

    case data.startsWith('add'):
      cache.wallet = data.split(' ').slice(-1)[0]
      return updateaccounts(cache.wallet).then((res) => {
        if (res) return `add wallet ${cache.wallet}`
        else return res
      })

    case data.startsWith('del'):
      return 'del...'

    case data.startsWith('wc:'):
      await initWalletConnect(data)
      return ''

    default:
      return 'Command not found!'
  }
}
