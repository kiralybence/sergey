const Command = require('./Command');
const Discord = require('discord.js');
const Utils = require('../classes/Utils');
const DuckDuckGo = require('duckduckgo-images-api');

module.exports = class ImgCommand extends Command {
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
            interaction.Reply(`No images found with keyword: \`${keyword}\``);
            return;
        }

        let image = Utils.randArr(images.slice(0, 10));

        interaction.editReply({
            content: `Image keyword: \`${keyword}\``,
            files: [new Discord.AttachmentBuilder(image.image)],
        });
    }
};