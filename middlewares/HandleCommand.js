const Middleware = require('./Middleware');

module.exports = class HandleCommand extends Middleware {
    async run(interaction) {
        // TODO: temporary solution
        const Sergey = require('../classes/Sergey');
        
        const command = Sergey.commands.find(command => command.command.name === interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        await command.execute(interaction);
    }
};