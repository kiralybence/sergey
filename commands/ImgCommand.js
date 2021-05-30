const Command = require('./Command')
const axios = require('axios')
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'img'
        })
    }

    async run(msg) {
        const query = this.getParamString(msg)

        axios.get('https://www.bing.com/images/search', {
            params: {
                q: query,
            }
        }).then(resp => {
            const html = resp.data

            let regex = new RegExp(/<img class="mimg" .*?src="(.*?)"/gi)
            let result
            let images = []
            while (result = regex.exec(html)) {
                images.push(result[1])
            }

            if (images.length === 0) {
                msg.reply('Nincs találat.')
                return
            }

            msg.reply(new Discord.MessageAttachment(randArr(images), 'image.jpg'))
        }).catch(err => {
            console.error(err)
            msg.reply('Hiba történt 😡')
        })
    }
}