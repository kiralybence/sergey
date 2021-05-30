const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'commands'
        })
    }

    async run(msg) {
        let reply = 'List of available commands:\n\n'

        registerCommands().forEach(command => {
            if (command.ownerOnly) return

            reply += `**!${command.name}** - ${command.description ? command.description : 'No description.'}\n`
        })

        msg.channel.send(reply)
    }
}