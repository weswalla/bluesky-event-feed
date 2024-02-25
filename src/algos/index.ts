import { AppContext } from '../config'
import {
  OutputSchema as AlgoOutput,
  QueryParams,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import * as hackBluesky from './hack-bluesky'

type AlgoHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
  [hackBluesky.shortname]: hackBluesky.handler,
}

export default algos
