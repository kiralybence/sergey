const Middleware = require('./Middleware');

module.exports = class AutoReactMiddleware extends Middleware {
    async run(msg) {
        const autoReactions = await query('select * from auto_reactions');

        autoReactions.forEach(autoReaction => {
            let normalizedMessage = removeAccents(msg.content).toLowerCase();
            let normalizedKeyword = removeAccents(autoReaction.keyword).toLowerCase();

            if (normalizedMessage.includes(normalizedKeyword)) {
                msg.react(autoReaction.emote);
            }
        });
    }
};