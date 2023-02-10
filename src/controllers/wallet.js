import * as ethers from 'ethers'
import WalletConnect from '@walletconnect/client'
import store from '@/controllers/store'
import local from '@/helpers/local'
import Controller, { getAppConfig } from '@/controllers'

export async function init() {
  let { activeIndex, chainId } = store
  const session = local.get('walletconnect')
  if (!session) {
    await Controller.init(activeIndex, chainId)
  } else {
    const connector = new WalletConnect({ session })
    const { connected, accounts, peerMeta } = connector
    const address = accounts[0]
    activeIndex = accounts.indexOf(address)
    chainId = connector.chainId
    await Controller.init(activeIndex, chainId)
    store.set({ connected, connector, address, activeIndex, accounts, chainId, peerMeta })
    subscribeToEvents(connector)
  }
  await getAppConfig().events.init(store, store.set)
}

function subscribeToEvents(connector) {
  console.log('ACTION', 'subscribeToEvents')

  connector.on('session_request', (error, payload) => {
    console.log('EVENT', 'session_request')
    if (error) throw error
    console.log('SESSION_REQUEST', payload.params)
    const { peerMeta } = payload.params[0]
    store.setMessage({
      type: 'text',
      author: 'wallet',
      data: { text: `name: ${peerMeta.name}\ndescription: ${peerMeta.description}\nurl: ${peerMeta.url}` },
    })
    store.set({ peerMeta })
  })

  connector.on('session_update', (error) => {
    console.log('EVENT', 'session_update')
    if (error) throw error
  })

  connector.on('call_request', async (error, payload) => {
    console.log('EVENT', 'call_request', 'method', payload.method)
    console.log('EVENT', 'call_request', 'params', payload.params)
    if (error) throw error
    await getAppConfig().rpcEngine.router(payload, store, store.set)
  })

  connector.on('connect', (error) => {
    console.log('EVENT', 'connect')
    if (error) throw error
    store.set({ connected: true })
  })

  connector.on('disconnect', (error) => {
    console.log('EVENT', 'disconnect')
    if (error) throw error
    store.init()
    init()
  })

  if (connector.connected) {
    const { chainId, accounts } = connector
    const index = 0
    const address = accounts[index]
    console.log(address, chainId)
    Controller.update(index, chainId)
  }
}

export const initWalletConnect = async (uri) => {
  store.set({ loading: true })
  try {
    const connector = new WalletConnect({ uri })
    if (!connector.connected) {
      await connector.createSession()
    }
    store.set({ connector, uri: connector.uri })
    subscribeToEvents(connector)
  } catch (err) {
    store.setMessage({ type: 'text', author: 'wallet', data: { text: 'wc: invalid' } })
  } finally {
    store.set({ loading: false })
  }
}

export async function updateaccounts(data) {
  const uri = typeof data === 'string' ? data : ''
  const { accounts } = store
  switch (true) {
    case uri.startsWith('wc:'): {
      store.set({ uri })
      await initWalletConnect(uri)
      return false
    }
    case ethers.utils.isAddress(uri): {
      const address = ethers.utils.getAddress(uri)
      if (accounts.includes(address)) {
        store.setMessage({ type: 'text', author: 'wallet', data: { text: 'account already exist' } })
        return false
      }
      store.updateAccounts([...accounts, address], accounts.length)
      return true
    }
    case uri.startsWith('ethereum:') && ethers.utils.isAddress(uri.slice(9)): {
      const address = ethers.utils.getAddress(uri.slice(9))
      if (accounts.includes(address)) {
        store.setMessage({ type: 'text', author: 'wallet', data: { text: 'account already exist' } })
        return false
      }
      store.updateAccounts([...accounts, address], accounts.length)
      return true
    }
    default:
      store.setMessage({ type: 'text', author: 'wallet', data: { text: 'invalid wallet' } })
      return undefined
  }
}