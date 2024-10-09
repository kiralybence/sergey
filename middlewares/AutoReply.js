const Discord = require('discord.js');
const Middleware = require('./Middleware');
const Formatter = require('../classes/Formatter');
const DB = require('../classes/DB');

module.exports = class AutoReply extends Middleware {
    async shouldRun(message) {
        return !message.author.bot;
    }

    async run(message) {
        const autoReplies = await DB.query('select * from auto_replies where is_enabled = 1');

        for (const autoReply of autoReplies) {
            let normalizedMessage = Formatter.removeAccents(message.content).toLowerCase();
            let normalizedKeyword = Formatter.removeAccents(autoReply.keyword).toLowerCase();

            if (normalizedMessage.includes(normalizedKeyword)) {
                await message.reply({
                    content: autoReply.message,
                    files: autoReply.embed ? [new Discord.AttachmentBuilder(autoReply.embed)] : null,
                });
            }
        }
    }
};