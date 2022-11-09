import { Redis } from '@upstash/redis'
import { getRedisToken, getRedisUrl } from '../utils/env'

function createUpstashClient() {
  return new Redis({
    url: getRedisUrl(),
    token: getRedisToken(),
  })
}

const client = createUpstashClient()
export default client
