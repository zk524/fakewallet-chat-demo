import { updateaccounts, initWalletConnect, updateSession, killSession } from '@/controllers/wallet'
import store from './store'

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

export const PayloadRequest = ({ payload, onApprove, onReject }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {payload.map(({ label, value }, index) => {
        return (
          <div key={payload + index} style={{ marginBottom: '5px' }}>
            <div style={{ marginBottom: '5px' }}>{label}:</div>
            <code style={{ backgroundColor: 'rgba(0,0,0,.1)', borderRadius: '5px', padding: '5px' }}>{value}</code>
          </div>
        )
      })}
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
    case data.startsWith('add'):
      cache.address = data.split(' ').slice(-1)[0]
      return updateaccounts(cache.address).then((res) => {
        if (res) return `add address ${cache.address}`
        else return res
      })

    case data.startsWith('del'):
      cache.address = data.split(' ').slice(-1)[0]
      cache.accounts = store.accounts.filter((address) => address !== cache.address)
      if (store.address === cache.address && store.connected) killSession()
      if (
        cache.accounts.length != store.accounts.length &&
        cache.address !== store.accounts[0] &&
        store.updateAccounts(cache.accounts)
      )
        return `del address ${cache.address}`
      return 'del failed'

    case data.startsWith('set'):
      cache.address = data.split(' ').slice(-1)[0]
      if (store.accounts.includes(cache.address)) {
        store.updateActiveIndex(store.accounts.indexOf(cache.address))
        await updateSession({})
        return `current address: ${cache.address}`
      } else return 'set failed'

    case data.startsWith('scan'):
      store.set({ scanner: true })
      return ''

    case data.startsWith('link'):
      return 'link...'

    case data.startsWith('sign'):
      return 'sign...'

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
