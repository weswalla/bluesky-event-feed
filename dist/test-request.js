"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFeed = void 0;
const index_1 = require("./index");
// TODO: Replace with your feed ID
const FEED_ID = 'event-feed';
const LIMIT = 35;
async function testFeed() {
    const endpoint = `http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton?feed=at://${index_1.FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${FEED_ID}&limit=${LIMIT}`;
    console.log(endpoint);
    const res = await fetch(endpoint, {
        headers: {
            'Accept-Language': 'en',
        },
    });
    const body = await res.json();
    return body;
}
exports.testFeed = testFeed;
testFeed().then((res) => {
    console.log(res);
});
