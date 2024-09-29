const Command = require('./Command');
const Emote = require('../classes/Emote');
const DB = require('../classes/DB');
const Utils = require('../classes/Utils');
const Discord = require('discord.js');

module.exports = class RollCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('roll')
        .setDescription('Gamble against the bot.');

	async execute(interaction) {
        await interaction.deferReply();

		let botPoints = Utils.rand(1, 100);
        let userPoints = await this.userPoints(interaction.user.id, botPoints);
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

    async userPoints(userId, botPoints) {
        let rigging = (await DB.query('select * from rigged_roll_users where user_id = ? limit 1', [userId]))[0] ?? null;

        if (!rigging) {
            return Utils.rand(1, 100);
        }

        switch (rigging.type) {
            case 'W':
                return Utils.rand(
                    botPoints + 1,
                    Math.max(100, botPoints + 1),
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