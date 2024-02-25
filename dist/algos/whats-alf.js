"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.shortname = void 0;
const xrpc_server_1 = require("@atproto/xrpc-server");
// max 15 chars
exports.shortname = 'whats-alf';
const handler = async (ctx, params) => {
    let builder = ctx.db
        .selectFrom('post')
        .selectAll()
        .orderBy('indexedAt', 'desc')
        .orderBy('cid', 'desc')
        .limit(params.limit);
    if (params.cursor) {
        const [indexedAt, cid] = params.cursor.split('::');
        if (!indexedAt || !cid) {
            throw new xrpc_server_1.InvalidRequestError('malformed cursor');
        }
        const timeStr = new Date(parseInt(indexedAt, 10)).toISOString();
        builder = builder
            .where('post.indexedAt', '<', timeStr)
            .orWhere((qb) => qb.where('post.indexedAt', '=', timeStr))
            .where('post.cid', '<', cid);
    }
    const res = await builder.execute();
    const feed = res.map((row) => ({
        post: row.uri,
    }));
    let cursor;
    const last = res.at(-1);
    if (last) {
        cursor = `${new Date(last.indexedAt).getTime()}::${last.cid}`;
    }
    return {
        cursor,
        feed,
    };
};
exports.handler = handler;
