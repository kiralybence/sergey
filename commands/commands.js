const Command = require('./Command');
const Sergey = require('../classes/Sergey');

module.exports = class CommandsCommand extends Command {
    constructor() {
        super({
            name: 'commands',
            description: 'List all commands.',
        });
    }

    async run(msg) {
        let list = 'List of available commands:\n\n';

        Sergey.commands.forEach(command => {
            if (command.ownerOnly) return;

            list += `**${command.example}** - ${command.description ?? 'No description.'}\n`;
        });

        msg.reply(list);
    }
};