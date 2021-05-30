const fs = require('fs')

module.exports = () => {
    global.getCommands = () => {
        let commands = fs.readdirSync(__dirname + '/../commands')

        // Remove .js extension
        commands = commands.map(command => command.replace('.js', ''))

        // The base command should not be registered
        commands = commands.filter(command => command !== 'Command')

        // Convert command names into command instances
        commands = commands.map(command => new (require('../commands/' + command)))

        return commands
    }
}