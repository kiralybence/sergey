const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    async run(msg) {
        const autoReactions = await queryPromise('SELECT * FROM auto_reactions')

        autoReactions.forEach(autoReaction => {
            let normalizedMessage = removeAccents(msg.content).toLowerCase()
            let normalizedKeyword = removeAccents(autoReaction.keyword).toLowerCase()

            if (normalizedMessage.includes(normalizedKeyword)) {
                msg.react(autoReaction.emote)
            }
        })
    }
}