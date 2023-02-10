import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ethereum-api.xyz',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const apiGetCustomRequest = async (chainId, customRpc) => {
  const response = await api.post(`config-request?chainId=${chainId}`, customRpc)
  const { result } = response.data
  return result
}
