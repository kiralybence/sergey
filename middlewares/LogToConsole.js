const Middleware = require('./Middleware');
const Log = require('../classes/Log');

module.exports = class extends Middleware {
    shouldRun(msg) {
        return true;
    }

    async run(msg) {
        Log.console(msg);
    }
};