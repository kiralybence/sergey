const Middleware = require('./Middleware');
const Log = require('../classes/Log');

module.exports = class extends Middleware {
    shouldRun(msg) {
        // If content is not empty
        return super.shouldRun(msg) && msg.content;
    }

    async run(msg) {
        await Log.database(msg);
    }
};