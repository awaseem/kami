import client from '../lib/upstash'

export function createRedisStore(namespace: string) {
  function genKey(key: string) {
    return `${namespace}:${key}`
  }

  async function setExpiry(
    key: string,
    value: string,
    expiry = 1800,
  ): Promise<void> {
    try {
      const newKey = genKey(key)
      await client.set(newKey, value, { ex: expiry })
    } catch (error) {
      console.log('Cache create miss due to error', error)
      return undefined
    }
  }

  async function set(key: string, value: string): Promise<void> {
    try {
      const newKey = genKey(key)
      await client.set(newKey, value)
    } catch (error) {
      console.log('Cache create miss due to error', error)
      return undefined
    }
  }

  async function get(key: string): Promise<string | undefined> {
    try {
      const newKey = genKey(key)
      const data = await client.get(newKey)

      if (typeof data !== 'string') {
        return undefined
      }

      return data
    } catch (error) {
      console.log('Cache miss due to error', error)
      return undefined
    }
  }

  async function setObj<T>(key: string, value: T): Promise<void> {
    try {
      const objStr = JSON.stringify(value)

      const newKey = genKey(key)
      await set(newKey, objStr)
    } catch (error) {
      console.log('Cache create obj miss due to error', error)
      return undefined
    }
  }

  async function setExpiryObj<T>(
    key: string,
    value: T,
    expiry = 1800,
  ): Promise<void> {
    try {
      const objStr = JSON.stringify(value)

      const newKey = genKey(key)
      await setExpiry(newKey, objStr, expiry)
    } catch (error) {
      console.log('Cache create obj miss due to error', error)
      return undefined
    }
  }

  async function getObj<T>(key: string): Promise<T | undefined> {
    try {
      const newKey = genKey(key)
      const data = await get(newKey)
      if (!data) {
        return undefined
      }

      return JSON.parse(data) as T
    } catch (error) {
      console.log('Cache miss obj due to error', error)
      return undefined
    }
  }

  async function remove(key: string): Promise<void> {
    try {
      const newKey = genKey(key)
      await client.del(newKey)
    } catch (error) {
      console.log('Cache delete miss due to error', error)
      return
    }
  }

  return Object.freeze({
    remove,
    get,
    getObj,
    set,
    setObj,
    setExpiry,
    setExpiryObj,
  })
}
