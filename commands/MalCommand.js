const Command = require('./Command')
const axios = require('axios')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'mal'
        })
    }

    async run(msg) {
        const inputs = this.getParamArray(msg)
        const allowedTypes = ['all', 'anime', 'manga', 'character', 'person', 'news', 'featured', 'forum', 'club', 'user']
        let param = inputs.shift()
        let type
        let query

        if (allowedTypes.includes(param)) {
            type = param
            query = inputs.join(' ')
        } else {
            type = 'all'
            query = msg.content.substring(12)
        }

        axios.get('https://myanimelist.net/search/prefix.json', {
            params: {
                type: type,
                keyword: query,
                v: 1,
            }
        }).then(resp => {
            const category = resp.data.categories[0]
            const results = category.items

            if (results.length > 0) {
                const result = results[0]

                msg.reply(`${result.name}: ${result.url}`)
            } else {
                msg.reply('Nincs találat <:KEKW:688705946691567687>')
            }
        }).catch(err => {
            console.error(err)
            msg.reply('Hiba történt 😡')
        })
    }
}