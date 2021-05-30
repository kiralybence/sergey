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
                limit: 100,
            },
        }).then(resp => {
            const allowedTypes = ['jpg', 'png', 'webp', 'gif']
            let posts = resp.data.data.children.filter(post => {
                // Filter posts that contain media of allowed types
                return allowedTypes.some(type => post.data.url.endsWith('.' + type))
            })

            if (posts.length === 0) {
                msg.reply('Nincs érvényes top poszt.')
                return
            }

            let randomImg = randArr(posts).data.url

            msg.reply(new Discord.MessageAttachment(randomImg))
        }).catch(err => {
            console.error(err)
            msg.reply('Hiba történt 😡')
        })
    }
}