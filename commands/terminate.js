const Command = require('./Command');
const Formatter = require('../classes/Formatter');

module.exports = class TerminateCommand extends Command {
    constructor() {
        super({
            name: 'terminate',
            description: 'Terminates the bot.',
            ownerOnly: true,
        });
    }

    async run(msg) {
        const timestamp = Formatter.formatTimestamp(new Date());
        console.log(`[${timestamp}] Terminated by !${this.name} command.`);
        process.exit();
    }
};