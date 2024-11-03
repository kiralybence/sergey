import Command from './Command.js';
import * as Discord from 'discord.js';
import Utils from '../classes/Utils.js';
import DuckDuckGo from 'duckduckgo-images-api';

export default class ImgCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('img')
        .setDescription('Show a random image from the internet.')
        .addStringOption(option => 
            option
                .setName('keyword')
                .setDescription('The keyword you want to search for.')
                .setRequired(true)
        );

    async execute(interaction) {
        await interaction.deferReply();

        let keyword = interaction.options.getString('keyword');
        let images = await DuckDuckGo.image_search({ query: keyword });

        if (images.length === 0) {
            interaction.editReply(`No images found with keyword: \`${keyword}\``);
            return;
        }

        let image = Utils.randArr(images.slice(0, 10));

        interaction.editReply({
            content: `Image keyword: \`${keyword}\``,
            files: [new Discord.AttachmentBuilder(image.image)],
        });
    }
}