export { observer } from 'mobx-react-lite'
import { makeAutoObservable, runInAction } from 'mobx'
import local from '@/controllers/local'

const message = { type: 'text', author: 'wallet', data: { text: 'Welcome to Fake Wallet!' } }
const INIT = () => {
  return {
    loading: false,
    scanner: false,
    connected: false,
    connector: null,
    uri: '',
    chainId: 1,
    accounts: JSON.parse(local.get('__fakewallet__') || '[]'),
    address: '',
    requests: [],
    results: [],
    activeIndex: 0,
    payload: null,
    peerMeta: {
      description: '',
      url: '',
      icons: [],
      name: '',
      ssl: false,
    },
  }
}

class Store {
  loading = false
  scanner = false
  connected = false
  connector = null
  uri = ''
  chainId = 1
  accounts = []
  wallets = []
  activeIndex = 0
  address = ''
  requests = []
  results = []
  payload = {}
  peerMeta = { description: '', url: '', icons: [], name: '', ssl: false }

  inputActive = false
  inputHasText = false
  emojiPickerIsOpen = false
  messageList = [message]

  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  init = () => this.set(INIT())

  set = (data) => {
    runInAction(() => Object.keys(data).forEach((key) => (this[key] = data[key])))
  }

  updateAddress = (index) => {
    this.activeIndex = index
  }

  updateAccounts = (accounts, index) => {
    runInAction(() => (this.accounts = accounts))
    local.set('__fakewallet__', JSON.stringify(accounts))
    this.address = accounts.slice(-1)[0]
    if (index !== void 0) this.activeIndex = index
  }

  setMessage = (msg) => {
    runInAction(() => (this.messageList = [...this.messageList, msg]))
  }
}

export default new Store()
