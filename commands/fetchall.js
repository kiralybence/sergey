const Command = require('./Command');
const MessageFetcher = require('../classes/MessageFetcher');
const Discord = require('discord.js');
const DB = require('../classes/DB');
const Formatter = require('../classes/Formatter');

module.exports = class FetchallCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('fetchall')
        .setDescription('Export and store all messages from the channel.');

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!this.isRequestedByOwner(interaction)) {
            interaction.editReply({ content: 'This command can only be used by the bot\'s owner.', ephemeral: true });
            return;
        }

        let fetchableChannels = await DB.query('select * from fetchable_channels');

        await interaction.editReply(`Fetching messages in ${fetchableChannels.length} channels. Check the console for further info.`);

        for (const channel of fetchableChannels) {
            let timestamp = Formatter.formatTimestamp(new Date());
            let logMessage = `Fetching: ${channel.description}`;

            console.log(`[${timestamp}] ${logMessage}`);
            await MessageFetcher.fromChannel(channel.channel_id);
        }

        // TODO: kéne erre a timestampes console logolásra valami külön függvény
        let timestamp = Formatter.formatTimestamp(new Date());
        let logMessage = 'Fetching messages done.';

        console.log(`[${timestamp}] ${logMessage}`);
    }
};