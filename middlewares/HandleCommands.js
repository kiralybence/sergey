const Middleware = require('./Middleware');
const Sergey = require('../classes/Sergey');

module.exports = class HandleCommandsMiddleware extends Middleware {
    async run(msg) {
        Sergey.commands.forEach(cmd => {
            if (cmd.shouldRun(msg)) {
                cmd.run(msg);
            }
        });
    }
};