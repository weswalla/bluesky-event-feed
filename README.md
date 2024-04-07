# ATProto Feed Generator

This is a starter kit for creating ATProto Feed Generators. It's not feature complete, but should give you a good starting ground off of which to build and deploy a feed.

## Overview

Feed Generators are services that provide custom algorithms to users through the AT Protocol.

They work very simply: the server receives a request from a user's server and returns a list of [post URIs](https://atproto.com/specs/at-uri-scheme) with some optional metadata attached. Those posts are then hydrated into full views by the requesting server and sent back to the client. This route is described in the [`app.bsky.feed.getFeedSkeleton` lexicon](https://atproto.com/lexicons/app-bsky-feed#appbskyfeedgetfeedskeleton).

A Feed Generator service can host one or more algorithms. The service itself is identified by DID, while each algorithm that it hosts is declared by a record in the repo of the account that created it. For instance, feeds offered by Bluesky will likely be declared in `@bsky.app`'s repo. Therefore, a given algorithm is identified by the at-uri of the declaration record. This declaration record includes a pointer to the service's DID along with some profile information for the feed.

The general flow of providing a custom algorithm to a user is as follows:

- A user requests a feed from their server (PDS) using the at-uri of the declared feed
- The PDS resolves the at-uri and finds the DID doc of the Feed Generator
- The PDS sends a `getFeedSkeleton` request to the service endpoint declared in the Feed Generator's DID doc
  - This request is authenticated by a JWT signed by the user's repo signing key
- The Feed Generator returns a skeleton of the feed to the user's PDS
- The PDS hydrates the feed (user info, post contents, aggregates, etc.)
  - In the future, the PDS will hydrate the feed with the help of an App View, but for now, the PDS handles hydration itself
- The PDS returns the hydrated feed to the user

For users, this should feel like visiting a page in the app. Once they subscribe to a custom algorithm, it will appear in their home interface as one of their available feeds.

## Getting Started

We've set up this simple server with SQLite to store and query data. Feel free to switch this out for whichever database you prefer.

Next, you will need to do two things:

1. Implement indexing logic in `src/subscription.ts`.

   This will subscribe to the repo subscription stream on startup, parse events and index them according to your provided logic.

2. Implement feed generation logic in `src/algos`

   For inspiration, we've provided a very simple feed algorithm (`hack-bluesky`) that returns all posts related to the titular character of the TV show ALF.

   You can either edit it or add another algorithm alongside it. The types are in place, and you will just need to return something that satisfies the `SkeletonFeedPost[]` type.

We've taken care of setting this server up with a did:web. However, you're free to switch this out for did:plc if you like - you may want to if you expect this Feed Generator to be long-standing and possibly migrating domains.

### Testing & Deploying your feed

1. Copy .env.example to .env
2. Search for `export const FEEDGEN_PUBLISHER_DID` and set that constant to your did. You can find your accounts DID by going to https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${YOUR_HANDLE}
3. You can test your feed by running `ts-node src/test-request.ts`
4. To make your feed accessible in the bluesky app, you'll need to host it on a server that can respond to HTTPS queries over port 443. We'll use Heroku.

   a. go to https://heroku.com

   b. sign up. you are required to do 2FA

   c. once you have an account, you are require to enter a credit card. you can use the free plan, but they all make you do this unfortunately

   d. now create an app. call it anything

   e. to deploy, i recommend the heroku cli. in your terminal: `heroku login`. it'll take you to your browser to auth

   f. add the heroku remote to your git repo (replace with your app name): `heroku git:remote -a your_heroku_app_name`

   g. push to the heroku remote (after committing the changes you want to deploy): `git push heroku`

   h. if the deploy failed, grab Cooper and he'll help you; if it succeeded, it will print the url it is deployed to. Copy that to the `FEEDGEN_HOSTNAME` constant in `index.ts`

5. Woohoo! Now that your feed is hosted on a web server, you can "publish" the feed on Bluesky, which means to tell Bluesky that your feed exists and how it can be reached and to attach the feed to your profile. That's the next section.

### Publishing your feed

1. Fill in your Bluesky handle and password in .env
2. Go to the script at `scripts/publishFeedGen.ts` and fill in the variables at the top. The record name and display name are required. We recommend adding a description. You can change these things later. To publish it, run `ts-node scripts/publishFeedGen.ts`.

To update your feed's display data (name, avatar, description, etc.), just update the relevant variables and re-run the script.

After successfully running the script, you should be able to see your feed from within the app, as well as share it by embedding a link in a post (similar to a quote post).

## Some Details

### Skeleton Metadata

The skeleton that a Feed Generator puts together is, in its simplest form, a list of post URIs.

```ts
;[
  { post: 'at://did:example:1234/app.bsky.feed.post/1' },
  { post: 'at://did:example:1234/app.bsky.feed.post/2' },
  { post: 'at://did:example:1234/app.bsky.feed.post/3' },
]
```

However, we include an additional location to attach some context. Here is the full schema:

```ts
type SkeletonItem = {
  post: string // post URI

  // optional reason for inclusion in the feed
  // (generally to be displayed in client)
  reason?: Reason
}

// for now, the only defined reason is a repost, but this is open to extension
type Reason = ReasonRepost

type ReasonRepost = {
  $type: 'app.bsky.feed.defs#skeletonReasonRepost'
  repost: string // repost URI
}
```

This metadata serves two purposes:

1. To aid the PDS in hydrating all relevant post information
2. To give a cue to the client in terms of context to display when rendering a post

### Authentication

If you are creating a generic feed that does not differ for different users, you do not need to check auth. But if a user's state (such as follows or likes) is taken into account, we _strongly_ encourage you to validate their auth token.

Users are authenticated with a simple JWT signed by the user's repo signing key.

This JWT header/payload takes the format:

```ts
const header = {
  type: 'JWT',
  alg: 'ES256K', // (key algorithm) - in this case secp256k1
}
const payload = {
  iss: 'did:example:alice', // (issuer) the requesting user's DID
  aud: 'did:example:feedGenerator', // (audience) the DID of the Feed Generator
  exp: 1683643619, // (expiration) unix timestamp in seconds
}
```

We provide utilities for verifying user JWTs in the `@atproto/xrpc-server` package, and you can see them in action in `src/auth.ts`.

### Pagination

You'll notice that the `getFeedSkeleton` method returns a `cursor` in its response and takes a `cursor` param as input.

This cursor is treated as an opaque value and fully at the Feed Generator's discretion. It is simply passed through the PDS directly to and from the client.

We strongly encourage that the cursor be _unique per feed item_ to prevent unexpected behavior in pagination.

We recommend, for instance, a compound cursor with a timestamp + a CID:
`1683654690921::bafyreia3tbsfxe3cc75xrxyyn6qc42oupi73fxiox76prlyi5bpx7hr72u`

## Suggestions for Implementation

How a feed generator fulfills the `getFeedSkeleton` request is completely at their discretion. At the simplest end, a Feed Generator could supply a "feed" that only contains some hardcoded posts.

For most use cases, we recommend subscribing to the firehose at `com.atproto.sync.subscribeRepos`. This websocket will send you every record that is published on the network. Since Feed Generators do not need to provide hydrated posts, you can index as much or as little of the firehose as necessary.

Depending on your algorithm, you likely do not need to keep posts around for long. Unless your algorithm is intended to provide "posts you missed" or something similar, you can likely garbage collect any data that is older than 48 hours.

Some examples:

### Reimplementing What's Hot

To reimplement "What's Hot", you may subscribe to the firehose and filter for all posts and likes (ignoring profiles/reposts/follows/etc.). You would keep a running tally of likes per post and when a PDS requests a feed, you would send the most recent posts that pass some threshold of likes.

### A Community Feed

You might create a feed for a given community by compiling a list of DIDs within that community and filtering the firehose for all posts from users within that list.

### A Topical Feed

To implement a topical feed, you might filter the algorithm for posts and pass the post text through some filtering mechanism (an LLM, a keyword matcher, etc.) that filters for the topic of your choice.

## Community Feed Generator Templates

- [Python](https://github.com/MarshalX/bluesky-feed-generator) - [@MarshalX](https://github.com/MarshalX)
- [Ruby](https://github.com/mackuba/bluesky-feeds-rb) - [@mackuba](https://github.com/mackuba)

# Attributions

- logo: <a href="https://www.flaticon.com/free-icons/event" title="event icons">Event icons created by Freepik - Flaticon</a>
