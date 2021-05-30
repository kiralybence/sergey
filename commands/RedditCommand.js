const Command = require('./Command')
const Discord = require('discord.js')
const axios = require('axios')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'reddit'
        })
    }

    async run(msg) {
        if (this.getParamArray(msg)[0] === undefined) {
            msg.reply('Hiba: Nem adtad meg a subredditet.')
            return
        }

        axios.get('https://www.reddit.com/r/' + this.getParamArray(msg)[0] + '/top.json?t=all', {
            params: {
                limit: 1000,
            },
        }).then(resp => {
            let posts = resp.data.data.children
            let randomImg

            // TODO: check if contains any of these, to avoid infinite loop

            do {
                randomImg = randArr(posts).data.url
            } while (!(randomImg.endsWith('.jpg') || randomImg.endsWith('.png') || randomImg.endsWith('.webp')))

            msg.reply(new Discord.MessageAttachment(randomImg))
        }).catch(err => {
            console.error(err)
            msg.reply('Hiba történt 😡')
        })
    }
}