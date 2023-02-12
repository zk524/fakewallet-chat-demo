import * as ethers from 'ethers'
import { signTypedData_v4 } from 'eth-sig-util'
import { SUPPORTED_CHAINS } from '@/controllers/chainData'
import walletconnectLogo from '@/assets/walletconnect-logo.png'
import ethereum from '@/controllers/ethereum'
import local from '@/controllers/local'
import store from '@/controllers/store'

const ENTROPY_KEY = 'ENTROPY'
const MNEMONIC_KEY = 'MNEMONIC'
const ETH_STANDARD_PATH = "m/44'/60'/0'/0"
const DEFAULT_ACTIVE_INDEX = 0
const MAINNET_CHAIN_ID = 1
const DEFAULT_CHAIN_ID = 1
const API_KEY = '582a225362f74cb0bea84626a6140201'

class RpcEngine {
  engines = [ethereum]
  filter(payload) {
    const engine = this.getEngine(payload)
    return engine.filter(payload)
  }
  router(payload, state, setState) {
    const engine = this.getEngine(payload)
    return engine.router(payload, state, setState)
  }
  render(payload) {
    const engine = this.getEngine(payload)
    return engine.render(payload)
  }
  signer(payload, state, setState) {
    const engine = this.getEngine(payload)
    return engine.signer(payload, state, setState)
  }
  getEngine(payload) {
    const match = this.engines.filter((engine) => engine.filter(payload))
    if (!match || !match.length) throw new Error(`No RPC Engine found to handle payload with method ${payload.method}`)
    return match[0]
  }
}

const appConfig = {
  name: 'WalletConnect',
  logo: walletconnectLogo,
  chainId: MAINNET_CHAIN_ID,
  derivationPath: ETH_STANDARD_PATH,
  numberOfAccounts: 0,
  colors: {
    defaultColor: '12, 12, 13',
    backgroundColor: '40, 44, 52',
  },
  chains: SUPPORTED_CHAINS,
  styleOpts: {
    showPasteUri: true,
    showVersion: true,
  },
  rpcEngine: new RpcEngine(),
  events: {
    init: () => Promise.resolve(),
    update: () => Promise.resolve(),
  },
}

export function getChainData(chainId) {
  const chainData = SUPPORTED_CHAINS.filter((chain) => chain.chain_id === chainId)[0]
  if (!chainData) throw new Error('ChainId missing or not supported')
  if (chainData.rpc_url.includes('infura.io') && chainData.rpc_url.includes('%API_KEY%')) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY)
    return { ...chainData, rpc_url: rpcUrl }
  }
  return chainData
}

export function getAppConfig() {
  const accounts = store.accounts
  appConfig.numberOfAccounts = accounts.length
  return appConfig
}

export class Wallet extends ethers.Signer {
  address = null
  provider = null
  constructor(address, provider) {
    super()
    if (provider) this.provider = provider
    if (ethers.utils.isAddress(address)) this.address = ethers.utils.getAddress(address)
  }
  static loadWallet(index) {
    const accounts = store.accounts
    const account = accounts[index]
    return new Wallet(ethers.utils.getAddress(account))
  }
  getAddress() {
    return Promise.resolve(this.address)
  }
  signMessage(message) {
    // const requestdisplay = getrequestdisplay()
    const requestdisplay = () => {}
    const request = ethers.utils.hexlify(message)
    const type = 'message'
    return new Promise((resolve, reject) => {
      requestdisplay.setState({ request, type, resolve, reject })
    })
  }
  signTransaction(transaction) {
    // const requestdisplay = getrequestdisplay()
    const requestdisplay = () => {}
    const request = JSON.stringify(transaction)
    const type = 'transaction'
    requestdisplay.setState({ request, type })
    return new Promise((resolve, reject) => {
      requestdisplay.setState({ request, type, resolve, reject })
    })
  }
  connect(provider) {
    return new Wallet(this.address, provider)
  }
  get mnemonic() {
    throw new Error('Method not implemented.')
  }
  get privateKey() {
    throw new Error('Method not implemented.')
  }
  get publicKey() {
    throw new Error('Method not implemented.')
  }
  encrypt(password, options, progressCallback) {
    throw new Error('Method not implemented.')
  }
}

export class WalletController {
  path = ''
  entropy = ''
  mnemonic = ''
  wallet = null
  activeIndex = DEFAULT_ACTIVE_INDEX
  activeChainId = MAINNET_CHAIN_ID

  constructor() {
    this.path = this.getPath()
    this.entropy = this.getEntropy()
    this.mnemonic = this.getMnemonic()
    this.wallet = this.init()
  }

  get provider() {
    return this.wallet.provider
  }
  isActive() {
    if (!this.wallet) return this.wallet
    return null
  }
  getIndex() {
    return this.activeIndex
  }
  getWallet(index, chainId) {
    if (!this.wallet || this.activeIndex === index || this.activeChainId === chainId) return this.init(index, chainId)
    return this.wallet
  }
  getAccounts(count = getAppConfig().numberOfAccounts) {
    const accounts = []
    let wallet = null
    for (let i = 0; i < count; i++) {
      wallet = this.generateWallet(i)
      accounts.push(wallet.address)
    }
    return accounts
  }
  getData(key) {
    let value = local.get(key)
    if (!value) {
      switch (key) {
        case ENTROPY_KEY:
          value = this.generateEntropy()
          break
        case MNEMONIC_KEY:
          value = this.generateMnemonic()
          break
        default:
          throw new Error(`Unknown data key: ${key}`)
      }
      local.set(key, value)
    }
    return value
  }
  getPath(index = this.activeIndex) {
    this.path = `${getAppConfig().derivationPath}/${index}`
    return this.path
  }
  generateEntropy() {
    this.entropy = ethers.utils.hexlify(ethers.utils.randomBytes(16))
    return this.entropy
  }
  generateMnemonic() {
    this.mnemonic = ethers.utils.entropyToMnemonic(this.getEntropy())
    return this.mnemonic
  }
  generateWallet(index) {
    this.wallet = Wallet.loadWallet(index)
    return this.wallet
  }
  getEntropy() {
    return this.getData(ENTROPY_KEY)
  }
  getMnemonic() {
    return this.getData(MNEMONIC_KEY)
  }
  init(index = DEFAULT_ACTIVE_INDEX, chainId = DEFAULT_CHAIN_ID) {
    return this.update(index, chainId)
  }
  update(index, chainId) {
    this.activeIndex = index
    this.activeChainId = chainId
    const rpcUrl = getChainData(chainId).rpc_url
    const wallet = this.generateWallet(index)
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    this.wallet = wallet.connect(provider)
    return this.wallet
  }
  async populateTransaction(transaction) {
    let tx = Object.assign({}, transaction)
    if (this.wallet) {
      if (tx.gas) {
        tx.gasLimit = tx.gas
        delete tx.gas
      }
      if (tx.from) tx.from = ethers.utils.getAddress(tx.from)
      try {
        tx = await this.wallet.populateTransaction(tx)
        tx.gasLimit = ethers.BigNumber.from(tx.gasLimit).toHexString()
        tx.gasPrice = ethers.BigNumber.from(tx.gasPrice).toHexString()
        tx.nonce = ethers.BigNumber.from(tx.nonce).toHexString()
      } catch (err) {
        console.error('Error populating transaction', tx, err)
      }
    }
    return tx
  }
  async sendTransaction(transaction) {
    if (this.wallet) {
      if (transaction.from && transaction.from.toLowerCase() !== this.wallet.address.toLowerCase())
        console.error("Transaction request From doesn't match active account")
      if (transaction.from) delete transaction.from
      if ('gas' in transaction) {
        transaction.gasLimit = transaction.gas
        delete transaction.gas
      }
      const result = await this.wallet.sendTransaction(transaction)
      return result.hash
    } else console.error('No Active Account')
    return null
  }
  async signTransaction(data) {
    if (this.wallet) {
      if (data && data.from) delete data.from
      data.gasLimit = data.gas
      delete data.gas
      const result = await this.wallet.signTransaction(data)
      return result
    } else console.error('No Active Account')
    return null
  }
  async signMessage(data) {
    if (this.wallet) {
      const signingKey = new ethers.utils.SigningKey(this.wallet.privateKey)
      const sigParams = await signingKey.signDigest(ethers.utils.arrayify(data))
      const result = await ethers.utils.joinSignature(sigParams)
      return result
    } else console.error('No Active Account')
    return null
  }
  async signPersonalMessage(message) {
    if (this.wallet)
      return await this.wallet.signMessage(ethers.utils.isHexString(message) ? ethers.utils.arrayify(message) : message)
    else console.error('No Active Account')
    return null
  }
  async signTypedData(data) {
    if (this.wallet)
      return signTypedData_v4(Buffer.from(this.wallet.privateKey.slice(2), 'hex'), { data: JSON.parse(data) })
    else console.error('No Active Account')
    return null
  }
}

export default new WalletController()
