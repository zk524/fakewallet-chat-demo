import { updateaccounts, initWalletConnect, killSession } from '@/controllers/wallet'

export const ConnectRequest = ({ onApprove, onReject, peerMeta }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>Name: {peerMeta.name}</span>
      <span>Description: {peerMeta.description}</span>
      <span>Url: {peerMeta.url}</span>
      <div>
        <a onClick={onApprove} style={{ color: 'green', cursor: 'pointer', marginRight: '10px' }}>
          Aprove
        </a>
        <a onClick={onReject} style={{ color: 'red', cursor: 'pointer' }}>
          Reject
        </a>
      </div>
    </div>
  )
}

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
      return updateaccounts(cache.wallet).then((res) => {
        if (res) return `add wallet ${cache.wallet}`
        else return res
      })

    case data.startsWith('del'):
      return 'del...'

    case data.startsWith('wc:'):
      await initWalletConnect(data)
      return

    case data.startsWith('disconnect'):
      killSession()
      return

    default:
      return 'Command not found!'
  }
}
