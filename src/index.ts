import dotenv from 'dotenv'
import FeedGenerator from './server'

// SET THIS TO YOUR DID
// You can find your accounts DID by going to
// https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${YOUR_HANDLE}
export const FEEDGEN_PUBLISHER_DID = 'did:plc:snjxvu5fmqeyto5dqlwxjwgq'
export const FEEDGEN_HOSTNAME = 'bsky-feed-demo-298fbea23f16.herokuapp.com'

const run = async () => {
  dotenv.config()
  const hostname = FEEDGEN_HOSTNAME
  const serviceDid = FEEDGEN_PUBLISHER_DID
  const server = FeedGenerator.create({
    port: maybeInt(process.env.PORT) ?? 80,
    listenhost: FEEDGEN_HOSTNAME,
    sqliteLocation: maybeStr(process.env.FEEDGEN_SQLITE_LOCATION) ?? ':memory:',
    subscriptionEndpoint:
      maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ??
      'wss://bsky.network',
    publisherDid: FEEDGEN_PUBLISHER_DID,
    subscriptionReconnectDelay:
      maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
    hostname,
    serviceDid: `did:web:${FEEDGEN_HOSTNAME}`,
  })
  await server.start()
  console.log(
    `🤖 running feed generator at ${server.cfg.listenhost}:${server.cfg.port}`,
  )
}

const maybeStr = (val?: string) => {
  if (!val) return undefined
  return val
}

const maybeInt = (val?: string) => {
  if (!val) return undefined
  const int = parseInt(val, 10)
  if (isNaN(int)) return undefined
  return int
}

run()
