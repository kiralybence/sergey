const Command = require('./Command');
const Imitator = require('../classes/Imitator');
const Discord = require('discord.js');

module.exports = class ImitateCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('imitate')
        .setDescription('Imitate someone\'s writing style.')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user you want to imitate.')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option
                .setName('days')
                .setDescription('Set how recent should the messages be that will be used for imitation.')
        );

    async execute(interaction) {
        await interaction.deferReply();

        let user = interaction.options.getUser('user');
        let days = interaction.options.getInteger('days');
        let imitator = new Imitator(user.id, days);
        let text = await imitator.imitate();
        let name = user.globalName || user.username;

        interaction.editReply(`"${text}" - ${name}`);
    }
};