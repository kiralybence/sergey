import Command from './Command.js';
import DB from '../classes/DB.js';
import * as Discord from 'discord.js';
import Utils from '../classes/Utils.js';

export default class WordMostUsedByCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('wordmostusedby')
        .setDescription('Check who uses a certain word most often.')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('The word you want to check for.')
                .setRequired(true)
        );

    async execute(interaction) {
        await interaction.deferReply();

        let word = interaction.options.getString('word');

        let results = await DB.query(`
            select author_id, count(*) as count
            from fetched_words
            where word = :word
            group by author_id
            order by count desc
        `, {
            word: word.toLowerCase(),
            guild_id: interaction.guild.id,
        });

        let reply = [];

        for (let result of results) {
            let member = await Utils.getMember(interaction.guild.id, result.author_id);

            if (!member) {
                continue;
            }

            let index = reply.length + 1;
            let name = member.nickname || member.user.globalName || member.user.username;
            let count = result.count;

            reply.push(`${index}. ${name}: ${count}`);

            if (reply.length === 5) {
                break;
            }
        }

        reply.unshift(`Top 5 users of the word "${word}":\n`);

        await interaction.editReply(reply.join('\n'));
    }
}