const Command = require('./Command')
const Discord = require('discord.js')
const { image_search } = require('duckduckgo-images-api')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'img',
            description: 'Grab a random image from DuckDuckGo.',
            paramsRequired: 1,
        })
    }

    async run(msg) {
        await image_search({
            query: this.getParamString(msg),
        }).then(results => {
            if (results.length === 0) {
                msg.reply('Nincs találat.')
                return
            }

            msg.reply(new Discord.MessageAttachment(randArr(results).image))
        }).catch(err => {
            console.error(err)
            msg.reply('Hiba történt 😡')
        })
    }
}