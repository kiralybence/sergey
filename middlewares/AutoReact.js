const Middleware = require('./Middleware');
const Formatter = require('../classes/Formatter');
const DB = require('../classes/DB');

module.exports = class AutoReact extends Middleware {
    async shouldRun(message) {
        return !message.author.bot;
    }

    async run(message) {
        const autoReactions = await DB.query('select * from auto_reactions where is_enabled = 1');

        for (const autoReaction of autoReactions) {
            let normalizedMessage = Formatter.removeAccents(message.content).toLowerCase();
            let normalizedKeyword = Formatter.removeAccents(autoReaction.keyword).toLowerCase();

            if (this.shouldReply(normalizedKeyword, normalizedMessage, autoReaction.match_mode)) {
                await message.react(autoReaction.emote);
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
                throw 'Invalid match mode.';
        }
    }
};