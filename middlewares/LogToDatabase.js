const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    shouldRun(msg) {
        // If content is not empty
        return super.shouldRun(msg) && msg.content
    }

    async run(msg) {
        await logMsgToDb(msg)
    }
}