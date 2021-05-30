const Command = require('./Command')
const slugify = require('slugify')
const FormData = require('form-data')
const axios = require('axios')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'mk',
            description: 'Search on Mangakakalot.',
            paramsRequired: 1,
        })
    }

    async run(msg) {
        const query = slugify(this.getParamString(msg), '_')
        const formData = new FormData()
        formData.append('searchword', query)

        // TODO: "Disallowed Key Characters."
        axios.post('https://mangakakalot.com/home_json_search', formData)
            .then(resp => {
                const results = resp.data

                msg.reply(JSON.stringify(results))
                return

                if (results.length > 0) {
                    const result = results[0]

                    msg.reply(`${result.name} (Latest: ${result.lastchapter}): ${result.story_link}`)
                } else {
                    msg.reply('Nincs találat <:KEKW:688705946691567687>')
                }
            })
            .catch(err => {
                console.error(err)
                msg.reply('Hiba történt 😡')
            })
    }
}