const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    constructor() {
        super()

        this.commands = getCommands()
    }

    async shouldRun(msg) {
        return super.shouldRun(msg) && !await isBlacklistedUser(msg.author.id)
    }

    async run(msg) {
        this.commands.forEach(cmd => {
            if (cmd.shouldRun(msg)) {
                cmd.run(msg)
            }
        })
    }
}