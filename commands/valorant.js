const Command = require('./Command');
const axios = require('axios');
const Emote = require('../classes/Emote');

module.exports = class ValorantCommand extends Command {
    constructor() {
        super({
            name: 'valorant',
            description: 'Valorant stats.',
            paramsRequired: 1,
            example: '!valorant <name-tag>',
        });
    }

    async run(msg) {
        let [name, tag] = String(this.getParamArray(msg)[0]).split('#', 2);

        axios.get(`https://valorant.op.gg/api/renew`, {
            params: {
                gameName: name,
                tagLine: tag,
            },
        });

        axios.get(`https://valorant.op.gg/api/player`, {
            params: {
                gameName: name,
                tagLine: tag,
            },
        })
        .then(resp => resp.data)
        .then(resp => {
            let message = '';

            for (const match of resp.recentGames.matches) {
                let time = new Date(match.gameStartDateTime).toLocaleString();
                let result = match.won ? '🟩 Win' : `🟥 Lose ${Emote.KEKW}`;

                message += `[${time}] ${result} (${match.roundResults}) - ${match.character.name} (${match.kda} KDA)\n`;
            }

            msg.channel.send(message);
        });
    }
};