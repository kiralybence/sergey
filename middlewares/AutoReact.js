const Middleware = require('./Middleware');
const Formatter = require('../classes/Formatter');

module.exports = class AutoReactMiddleware extends Middleware {
    async run(msg) {
        const autoReactions = await query('select * from auto_reactions');

        autoReactions.forEach(autoReaction => {
            let normalizedMessage = Formatter.removeAccents(msg.content).toLowerCase();
            let normalizedKeyword = Formatter.removeAccents(autoReaction.keyword).toLowerCase();

            if (normalizedMessage.includes(normalizedKeyword)) {
                msg.react(autoReaction.emote);
            }
        });
    }
};