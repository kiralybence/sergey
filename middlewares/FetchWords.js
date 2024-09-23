const Middleware = require('./Middleware');
const Log = require('../classes/Log');

module.exports = class FetchWords extends Middleware {
    shouldRun(message) {
        return !message.author.bot;
    }

    async run(message) {
        await Log.database(message);
    }
};