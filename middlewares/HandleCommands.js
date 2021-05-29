const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    constructor() {
        super()

        this.commands = registerCommands()
    }

    async run(msg) {
        this.commands.forEach(cmd => {
            if (cmd.shouldRun(msg)) {
                cmd.run(msg)
            }
        })
    }
}