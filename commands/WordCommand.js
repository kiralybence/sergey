import Command from './Command.js';
import DB from '../classes/DB.js';
import * as Discord from 'discord.js';

export default class WordCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('word')
        .setDescription('Get a random word starting with a certain letter.')
        .addStringOption(option => 
            option
                .setName('letter')
                .setDescription('The letter the word should start with.')
                .setMaxLength(1)
                .setRequired(true)
        );

    async execute(interaction) {
        await interaction.deferReply();

        let letter = interaction.options.getString('letter');

        let word = (await DB.query('select * from x_words where word like :letter order by rand() limit 1', { letter: letter + '%' }))[0];

        if (!word) {
            interaction.editReply(`No words found that start with "${letter}".`);
            return;
        }

        interaction.editReply(word.word);
    }
}