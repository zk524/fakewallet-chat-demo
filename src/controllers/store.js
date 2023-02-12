export { observer } from 'mobx-react-lite'
import { makeAutoObservable, runInAction } from 'mobx'
import local from '@/controllers/local'

const INIT = () => {
  const accounts = JSON.parse(local.get('__fakewallet__') || '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]')
  if (accounts.length === 1) local.set('__fakewallet__', JSON.stringify(accounts))
  const address = accounts[0]
  return {
    loading: false,
    scanner: false,
    connected: false,
    connector: null,
    payload: null,
    uri: '',
    activeIndex: 0,
    chainId: 1,
    accounts,
    address,
    requests: [],
    results: [],
    peerMeta: {},
  }
}

class Store {
  loading = false
  scanner = false
  connected = false
  connector = null
  payload = null
  uri = ''
  chainId = 1
  activeIndex = 0
  accounts = []
  address = ''
  requests = []
  results = []
  peerMeta = {}

  inputActive = false
  inputHasText = false
  emojiPickerIsOpen = false
  messageList = [
    {
      type: 'text',
      author: 'wallet',
      data: {
        text: 'Welcome to Fake Wallet!\nMethods:\n 1.add [address]\n 2.del [address]\n 3.set [address]\n 4.[wc:...]\n 5.disconnect',
      },
    },
  ]

  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  init = () => this.set(INIT())
  set = (data) => runInAction(() => Object.keys(data).forEach((key) => (this[key] = data[key])))
  setMessage = (msg) => runInAction(() => (this.messageList = [...this.messageList, msg]))
  updateActiveIndex = (index) => {
    this.activeIndex = index
    this.address = this.accounts[index]
  }
  updateAccounts = (accounts, index) => {
    const count = accounts.length
    if (count === 0) return false
    runInAction(() => (this.accounts = accounts))
    local.set('__fakewallet__', JSON.stringify(accounts))
    this.address = accounts.slice(-1)[0]
    if (index !== void 0) this.activeIndex = index
    else if (this.activeIndex >= count) this.activeIndex = 0
    return true
  }
}

export default new Store()
