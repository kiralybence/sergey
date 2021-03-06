const Command = require('./Command')
const owoify = require('owoify-js').default

module.exports = class extends Command {
    constructor() {
        super({
            name: 'owoify',
            description: 'Turn your message to "owo" style.',
            paramsRequired: 1,
            example: '!owoify <message>',
        })
    }

    async run(msg) {
        const message = this.getParamString(msg)

        msg.channel.send(owoify(message))
    }
}