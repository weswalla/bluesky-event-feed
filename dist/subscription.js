"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirehoseSubscription = void 0;
const event_filter_1 = require("./event-filter");
const subscribeRepos_1 = require("./lexicon/types/com/atproto/sync/subscribeRepos");
const subscription_1 = require("./util/subscription");
class FirehoseSubscription extends subscription_1.FirehoseSubscriptionBase {
    async handleEvent(evt) {
        if (!(0, subscribeRepos_1.isCommit)(evt))
            return;
        const ops = await (0, subscription_1.getOpsByType)(evt);
        // This logs the text of every post off the firehose.
        // Just for fun :)
        // Delete before actually using
        // for (const post of ops.posts.creates) {
        //   console.log(post.record.text)
        // }
        const postsToDelete = ops.posts.deletes.map((del) => del.uri);
        const postsToCreate = ops.posts.creates
            .filter((create) => {
            return (0, event_filter_1.eventFilter)(create.record.text);
        })
            .map((create) => {
            return {
                uri: create.uri,
                cid: create.cid,
                replyParent: create.record?.reply?.parent.uri ?? null,
                replyRoot: create.record?.reply?.root.uri ?? null,
                indexedAt: new Date().toISOString(),
            };
        });
        if (postsToDelete.length > 0) {
            await this.db
                .deleteFrom('post')
                .where('uri', 'in', postsToDelete)
                .execute();
        }
        if (postsToCreate.length > 0) {
            await this.db
                .insertInto('post')
                .values(postsToCreate)
                .onConflict((oc) => oc.doNothing())
                .execute();
        }
    }
}
exports.FirehoseSubscription = FirehoseSubscription;
