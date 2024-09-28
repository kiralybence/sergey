const Middleware = require('./Middleware');
const Formatter = require('../classes/Formatter');
const DB = require('../classes/DB');

module.exports = class AutoReact extends Middleware {
    async shouldRun(message) {
        return !message.author.bot;
    }
    
    async run(message) {
        const autoReactions = await DB.query('select * from auto_reactions');

        for (const autoReaction of autoReactions) {
            let normalizedMessage = Formatter.removeAccents(message.content).toLowerCase();
            let normalizedKeyword = Formatter.removeAccents(autoReaction.keyword).toLowerCase();

            if (normalizedMessage.includes(normalizedKeyword)) {
                message.react(autoReaction.emote);
            }
        }
    }
};