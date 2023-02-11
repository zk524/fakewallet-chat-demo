const local = window.localStorage

export default {
  set(key, data) {
    local.setItem(key, JSON.stringify(data))
  },
  get(key) {
    const raw = local.getItem(key)
    if (raw && typeof raw === 'string') {
      try {
        return JSON.parse(raw)
      } catch {
        return null
      }
    }
    return null
  },
  del(key) {
    local.removeItem(key)
  },
  update(key, data) {
    const localData = local.getItem(key) || {}
    local.setItem(key, JSON.stringify({ ...localData, ...data }))
  },
}
