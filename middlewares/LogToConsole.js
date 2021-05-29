const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    shouldRun(msg) {
        return true
    }

    async run(msg) {
        console.log(`[${formatTimestamp(msg.createdTimestamp)}] ${msg.author.username}: ${msg.content}`)
    }
}