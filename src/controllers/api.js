import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ethereum-api.xyz',
  timeout: 30000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

export const apiGetCustomRequest = async (chainId, customRpc) =>
  api.post(`config-request?chainId=${chainId}`, customRpc).then(({ data }) => data.result)
