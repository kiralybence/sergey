const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'stop',
            description: 'Terminates the bot.',
            ownerOnly: true,
        })
    }

    async run(msg) {
        console.log('Terminated by !stop command.')
        process.exit()
    }
}