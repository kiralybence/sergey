const Middleware = require('./Middleware');
const Log = require('../classes/Log');

module.exports = class LogToConsole extends Middleware {
    async run(message) {
        Log.console(message);
    }
};