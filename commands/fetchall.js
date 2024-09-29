const Command = require('./Command');
const MessageFetcher = require('../classes/MessageFetcher');
const Discord = require('discord.js');
const DB = require('../classes/DB');
const Log = require('../classes/Log');

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

        let fetchableChannels = await DB.query('select * from fetchable_channels where is_enabled = 1');

        await interaction.editReply(`Fetching messages in ${fetchableChannels.length} channels. Check the console for further info.`);

        for (const channel of fetchableChannels) {
            Log.console(`Fetching: ${channel.description}`);
            await MessageFetcher.fromChannel(channel.channel_id);
        }

        Log.console('Fetching messages done.');
    }
};