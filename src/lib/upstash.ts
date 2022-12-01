import { Redis } from '@upstash/redis/with-fetch'
import { ENV_redisToken, ENV_redisUrl } from '../utils/env'

function createUpstashClient() {
  return new Redis({
    url: ENV_redisUrl,
    token: ENV_redisToken,
  })
}

const client = createUpstashClient()
export default client
