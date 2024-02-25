import { AtUri } from '@atproto/syntax'
import { InvalidRequestError } from '@atproto/xrpc-server'
import algos from '../algos'
import { AppContext } from '../config'
import { Server } from '../lexicon'

export default function (server: Server, ctx: AppContext) {
  server.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
    const feedUri = new AtUri(params.feed)
    const algo = algos[feedUri.rkey]
    if (
      feedUri.hostname !== ctx.cfg.publisherDid ||
      feedUri.collection !== 'app.bsky.feed.generator' ||
      !algo
    ) {
      console.log('Unsupported feed', feedUri)
      console.log('Supported feeds', Object.keys(algos))
      console.log('Publisher DID', ctx.cfg.publisherDid)
      console.log('feedUri.hostname', feedUri.hostname)
      console.log('feedUri.collection', feedUri.collection)
      throw new InvalidRequestError(
        'Unsupported algorithm',
        'UnsupportedAlgorithm',
      )
    }
    /**
     * Example of how to check auth if giving user-specific results:
     *
     * const requesterDid = await validateAuth(
     *   req,
     *   ctx.cfg.serviceDid,
     *   ctx.didResolver,
     * )
     */

    const body = await algo(ctx, params)
    return {
      encoding: 'application/json',
      body: body,
    }
  })
}
