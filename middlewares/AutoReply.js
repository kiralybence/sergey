const Middleware = require('./Middleware');
const Formatter = require('../classes/Formatter');
const DB = require('../classes/DB');

module.exports = class AutoReply extends Middleware {
    async shouldRun(message) {
        return !message.author.bot;
    }

    async run(message) {
        const autoReplies = await DB.query('select * from auto_replies');

        for (const autoReply of autoReplies) {
            let normalizedMessage = Formatter.removeAccents(message.content).toLowerCase();
            let normalizedKeyword = Formatter.removeAccents(autoReply.keyword).toLowerCase();

            if (normalizedMessage.includes(normalizedKeyword)) {
                message.reply(autoReply.reply);
            }
        }
    }
};