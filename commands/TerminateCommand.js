import Command from './Command.js';
import Log from '../classes/Log.js';
import * as Discord from 'discord.js';

export default class TerminateCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('terminate')
        .setDescription('Terminates the bot.');

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!this.isRequestedByOwner(interaction)) {
            await interaction.editReply('This command can only be used by the bot\'s owner.');
            return;
        }

        await interaction.editReply('Terminating the bot...');

        let logMessage = `Terminated by /${this.command.name} command.`;

        Log.console(logMessage);
        Log.file('info', logMessage);

        process.exit();
    }
}