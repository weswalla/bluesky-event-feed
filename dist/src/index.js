"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEEDGEN_PUBLISHER_DID = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server"));
// SET THIS TO YOUR DID
// You can find your accounts DID by going to
// https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${YOUR_HANDLE}
exports.FEEDGEN_PUBLISHER_DID = 'did:plc:snjxvu5fmqeyto5dqlwxjwgq';
const run = async () => {
    dotenv_1.default.config();
    const hostname = maybeStr(process.env.FEEDGEN_HOSTNAME) ?? 'example.com';
    const serviceDid = exports.FEEDGEN_PUBLISHER_DID;
    const server = server_1.default.create({
        port: maybeInt(process.env.PORT) ?? 80,
        listenhost: maybeStr(process.env.FEEDGEN_HOSTNAME) ?? 'http://localhost',
        sqliteLocation: maybeStr(process.env.FEEDGEN_SQLITE_LOCATION) ?? ':memory:',
        subscriptionEndpoint: maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ??
            'wss://bsky.network',
        publisherDid: exports.FEEDGEN_PUBLISHER_DID,
        subscriptionReconnectDelay: maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
        hostname,
        serviceDid,
    });
    await server.start();
    console.log(`🤖 running feed generator at http://${server.cfg.listenhost}:${server.cfg.port}`);
};
const maybeStr = (val) => {
    if (!val)
        return undefined;
    return val;
};
const maybeInt = (val) => {
    if (!val)
        return undefined;
    const int = parseInt(val, 10);
    if (isNaN(int))
        return undefined;
    return int;
};
run();
