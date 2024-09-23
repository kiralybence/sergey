const Middleware = require('./Middleware');
const MessageFetcher = require('../classes/MessageFetcher');

module.exports = class FetchWords extends Middleware {
    async shouldRun(message) {
        return !message.author.bot && await MessageFetcher.isFetchableChannel(message.channelId);
    }

    async run(message) {
        await MessageFetcher.fromMessage(message);
    }
};