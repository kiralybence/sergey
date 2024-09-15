const Middleware = require('./Middleware');
const Sergey = require('../classes/Sergey');

module.exports = class HandleCommandsMiddleware extends Middleware {
    async run(msg) {
        for (const cmd of Sergey.commands) {
            if (cmd.shouldRun(msg)) {
                await cmd.run(msg);
            }
        }
    }
};