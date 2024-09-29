const Command = require('./Command');
const Emote = require('../classes/Emote');
const Utils = require('../classes/Utils');
const Discord = require('discord.js');

module.exports = class RollCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('roll')
        .setDescription('Gamble against the bot.');

	async execute(interaction) {
        await interaction.deferReply();

		let userPoints = Utils.rand(1, 100);
        let botPoints = Utils.rand(1, 100);
        let result;

        if (userPoints < botPoints) {
            result = `Winner: Sergey ${await Emote.get('KEKWDISCO')}`;
        } else if (userPoints > botPoints) {
            result = `Winner: ${interaction.user.globalName} ${await Emote.get('KEKWait')}`;
        } else if (userPoints === botPoints) {
            result = await Emote.get('4Weird');
        } else {
            result = 'Ennek az üzenetnek soha nem szabadna látszódnia.';
        }

        interaction.editReply(`${interaction.user.globalName}: ${userPoints}\nSergey: ${botPoints}\n\n${result}`);
	}
};