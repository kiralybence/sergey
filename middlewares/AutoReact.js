const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    async run(msg) {
        const autoReactions = await queryPromise('SELECT * FROM auto_reactions')

        autoReactions.forEach(autoReaction => {
            if (msg.content.toLowerCase().includes(autoReaction.keyword)) {
                msg.react(autoReaction.emote)
            }
        })
    }
}