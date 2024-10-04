const Command = require('./Command');
const Emote = require('../classes/Emote');
const DB = require('../classes/DB');
const Utils = require('../classes/Utils');
const Discord = require('discord.js');

module.exports = class RollCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('roll')
        .setDescription('Gamble against the bot.')
        .addNumberOption(option =>
            option
                .setName('max')
                .setDescription('The maximum number to be rolled.')
                .setMinValue(1)
                .setMaxValue(Number.MAX_VALUE)
        );

	async execute(interaction) {
        await interaction.deferReply();

        let max = interaction.options.getNumber('max') ?? 100;
		let botPoints = Utils.rand(1, max);
        let userPoints = await this.userPoints(interaction.user.id, botPoints, max);
        let result;

        if (userPoints < botPoints) {
            result = `Winner: Sergey ${await Emote.get('KEKWDISCO', '😎')}`;
        } else if (userPoints > botPoints) {
            result = `Winner: ${interaction.user.globalName} ${await Emote.get('KEKWait', '😡')}`;
        } else if (userPoints === botPoints) {
            result = await Emote.get('4Weird', '⚖️');
        } else {
            result = 'This message should never be visible.';
        }

        interaction.editReply(`${interaction.user.globalName}: ${userPoints}\nSergey: ${botPoints}\n\n${result}`);
	}

    async userPoints(userId, botPoints, max) {
        let rigging = (await DB.query('select * from rigged_roll_users where user_id = ? limit 1', [userId]))[0] ?? null;

        if (!rigging) {
            return Utils.rand(1, max);
        }

        switch (rigging.type) {
            case 'W':
                return Utils.rand(
                    botPoints + 1,
                    Math.max(max, botPoints + 1),
                );
            
            case 'L':
                return Utils.rand(
                    Math.min(1, botPoints - 1),
                    botPoints - 1,
                );

            case 'D':
                return botPoints;

            default:
                throw `Error: Rigging exists, but type wasn\'t recognized (${rigging.type}).`;
        }
    }
};