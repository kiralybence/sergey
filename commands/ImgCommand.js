const Command = require('./Command')
const axios = require('axios')
const Discord = require('discord.js')
const fs = require('fs')

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

            let regex = new RegExp('<img class="mimg" .*?src="(.*?)"', "gi")
            let result
            let images = []
            while (result = regex.exec(html)) {
                images.push(result[1])
            }

            let randomImg = randArr(images)

            if (randomImg) {
                axios.get(randomImg, {responseType: 'stream'})
                    .then(resp => {
                        resp.data.pipe(fs.createWriteStream('./temp.jpg'))
                        msg.reply(new Discord.MessageAttachment('./temp.jpg'))
                        // fs.unlinkSync('./temp.jpg')
                    })
                    .catch(err => {
                        console.error(err)
                        msg.reply('Hiba történt 😡')
                    })
            } else {
                msg.reply('Nincs találat 😡')
            }
        }).catch(err => {
            console.error(err)
            msg.reply('Hiba történt 😡')
        })
    }
}