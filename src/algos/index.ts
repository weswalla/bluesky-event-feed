import { AppContext } from '../config'
import {
  OutputSchema as AlgoOutput,
  QueryParams,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import * as eventFeed from './event-feed'

type AlgoHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
  [eventFeed.shortname]: eventFeed.handler,
}

export default algos
