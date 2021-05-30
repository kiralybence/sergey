const Command = require('./Command')
const owoify = require('owoify-js').default

module.exports = class extends Command {
    constructor() {
        super({
            name: 'owoify',
            paramsRequired: 1,
        })
    }

    async run(msg) {
        const message = this.getParamString(msg)

        msg.channel.send(owoify(message))
    }
}