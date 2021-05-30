const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'example'
        })
    }

    async run(msg) {
        msg.channel.send('Example command reply.')
    }
}