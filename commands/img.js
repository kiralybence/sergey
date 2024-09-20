const Command = require('./Command');
const Discord = require('discord.js');
const Utils = require('../classes/Utils');
const { image_search } = require('duckduckgo-images-api');

module.exports = class ImgCommand extends Command {
    constructor() {
        super({
            name: 'img',
            description: 'Grab a random image from DuckDuckGo.',
            paramsRequired: 1,
            example: '!img <keywords>',
        })
    }

    async run(msg) {
        let keyword = this.getParamString(msg);
        let images = await image_search({query: keyword});

        if (images.length === 0) {
            msg.reply(`No images found with keyword: "${keyword}"`);
            return;
        }

        msg.reply({ content: `Image keyword: "${keyword}"`, files: [new Discord.AttachmentBuilder(Utils.randArr(images.slice(0, 10)).image)] });
    }
};