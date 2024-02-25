import { FEEDGEN_PUBLISHER_DID } from './index'

// TODO: Replace with your feed ID
const FEED_ID = 'hack-bluesky'
const LIMIT = 35

export async function testFeed() {
  const endpoint = `http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton?feed=at://${FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${FEED_ID}&limit=${LIMIT}`
  console.log(endpoint)
  const res = await fetch(endpoint, {
    headers: {
      'Accept-Language': 'en',
    },
  })
  const body = await res.json()
  return body
}

testFeed().then((res) => {
  console.log(res)
})
