const Middleware = require('./Middleware');
const Log = require('../classes/Log');

module.exports = class LogToConsoleMiddleware extends Middleware {
    shouldRun(msg) {
        return true;
    }

    async run(msg) {
        Log.console(msg);
    }
};