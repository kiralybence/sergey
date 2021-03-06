const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'commands',
            description: 'List all commands.',
        })
    }

    async run(msg) {
        let list = 'List of available commands:\n\n'

        getCommands().forEach(command => {
            if (command.ownerOnly) return

            list += `**${command.example}** - ${command.description ? command.description : 'No description.'}\n`
        })

        msg.reply(list)
    }
}