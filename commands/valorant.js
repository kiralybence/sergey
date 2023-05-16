const Command = require('./Command')
const axios = require('axios')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'valorant',
            description: 'Valorant stats.',
            paramsRequired: 1,
            example: '!valorant <name-tag>',
        })
    }

    async run(msg) {
        let [name, tag] = String(this.getParamArray(msg)[0]).split('#', 2)

        axios.get(`https://valorant.op.gg/api/renew?gameName=${name}&tagLine=${tag}`)

        axios.get(`https://valorant.op.gg/api/player?gameName=${name}&tagLine=${tag}`)
            .then(resp => {
                const stats = resp.data
                let message = ''

                stats.recentGames.matches.forEach(match => {
                    let time = new Date(match.gameStartDateTime).toLocaleString()
                    let result = match.won ? '🟩 Win' : '🟥 Lose <:KEKW:688705946691567687>'

                    message += `[${time}] ${result} (${match.roundResults}) - ${match.character.name} (${match.kda} KDA)\n`
                })

                msg.channel.send(message)
            })
    }
}