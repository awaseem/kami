import client from '../lib/upstash'

export function createRedisStore(namespace: string) {
  function genKey(key: string) {
    return `${namespace}:${key}`
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

  async function remove(key: string): Promise<void> {
    try {
      const newKey = genKey(key)
      await client.del(newKey)
    } catch (error) {
      console.log('Cache delete miss due to error', error)
      return
    }
  }

  async function setObj<T>(key: string, value: T): Promise<void> {
    try {
      client.set<T>(key, value)
    } catch (error) {
      console.log('Cache create obj miss due to error', error)
      return undefined
    }
  }
  async function getObj<T>(key: string): Promise<T | undefined> {
    try {
      return client.get(key) as Promise<T | undefined>
    } catch (error) {
      console.log('Cache miss obj due to error', error)
      return undefined
    }
  }

  return Object.freeze({
    remove,
    get,
    getObj,
    set,
    setObj,
  })
}
