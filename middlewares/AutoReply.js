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

            if (this.shouldReply(normalizedKeyword, normalizedMessage, autoReply.match_mode)) {
                await message.reply({
                    content: autoReply.message,
                    files: autoReply.embed ? [new Discord.AttachmentBuilder(autoReply.embed)] : null,
                });
            }
        }
    }

    shouldReply(keyword, message, matchMode) {
        switch (matchMode) {
            case 'message':
                return message === keyword;

            case 'word':
                return message.split().some(word => word === keyword);

            case 'any':
                return message.includes(keyword);
            
            default:
                throw 'Invalid matchMode.';
        }
    }
};