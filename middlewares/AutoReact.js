const Middleware = require('./Middleware');
const Formatter = require('../classes/Formatter');
const DB = require('../classes/DB');

module.exports = class AutoReact extends Middleware {
    async run(message) {
        const autoReactions = await DB.query('select * from auto_reactions');

        autoReactions.forEach(autoReaction => {
            let normalizedMessage = Formatter.removeAccents(message.content).toLowerCase();
            let normalizedKeyword = Formatter.removeAccents(autoReaction.keyword).toLowerCase();

            if (normalizedMessage.includes(normalizedKeyword)) {
                message.react(autoReaction.emote);
            }
        });
    }
};