const Command = require('./Command');
const Discord = require('discord.js');
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
        let images = await image_search({query: this.getParamString(msg)});

        if (images.length === 0) {
            msg.reply('Nincs találat.');
            return;
        }

        msg.reply(new Discord.MessageAttachment(randArr(images.slice(0, 10)).image));
    }
};