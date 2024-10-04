const Command = require('./Command');
const DB = require('../classes/DB');
const Discord = require('discord.js');

module.exports = class InsultCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('insult')
        .setDescription('Insult someone.')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user you want to insult.')
                .setRequired(true)
        );

    async execute(interaction) {
        await interaction.deferReply();

        let user = interaction.options.getUser('user');
        let insult = (await DB.query('select * from insults where is_enabled = 1 order by rand() limit 1'))[0];

        if (!insult) {
            interaction.editReply('No insults found.');
            return;
        }

        interaction.editReply(`${user} ${insult.message}`);
    }
};