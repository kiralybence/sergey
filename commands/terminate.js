const Command = require('./Command');
const Formatter = require('../classes/Formatter');
const Sergey = require('../classes/Sergey');
const Discord = require('discord.js');

module.exports = class TerminateCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('terminate')
        .setDescription('Terminates the bot.');

    async execute(interaction) {
        await interaction.deferReply();

        if (!this.isRequestedByOwner(interaction)) {
            interaction.editReply({ content: 'This command can only be used by the bot\'s owner.', ephemeral: true });
            return;
        }

        await interaction.editReply('Terminating the bot...');

        let timestamp = Formatter.formatTimestamp(new Date());
        let logMessage = `Terminated by /${this.command.name} command.`;

        console.log(`[${timestamp}] ${logMessage}`);

        await Sergey.logger.log({
            level: 'info',
            message: logMessage,
        });

        process.exit();
    }
};