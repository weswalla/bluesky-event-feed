"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFeed = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const FEEDGEN_PUBLISHER_DID = process.env.FEEDGEN_PUBLISHER_DID;
const FEED_ID = 'whats-alf';
const LIMIT = 35;
async function testFeed() {
    const endpoint = `http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton?feed=at://${FEEDGEN_PUBLISHER_DID}/app.bsky.feed.generator/${FEED_ID}&limit=${LIMIT}`;
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
