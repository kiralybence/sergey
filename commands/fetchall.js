const Command = require('./Command');
const MessageFetcher = require('../classes/MessageFetcher');
const Discord = require('discord.js');
const DB = require('../classes/DB');

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

        await interaction.editReply(`Fetching messages in ${fetchableChannels.length} channels...`);

        for (const channel of fetchableChannels) {
            await interaction.followUp({ content: `Fetching: ${channel.description}`, ephemeral: true });
            await MessageFetcher.fromChannel(channel.channel_id);
        }

        await interaction.followUp({ content: 'Fetching messages done.', ephemeral: true });
    }
};