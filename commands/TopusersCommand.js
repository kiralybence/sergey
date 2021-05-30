const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'topusers',
            paramsRequired: 1,
        })
    }

    async run(msg) {
        const word = msg.content.substring(10)
        const wordCounts = await queryPromise('SELECT author_id, COUNT(*) as use_count FROM words WHERE word LIKE ? GROUP BY author_id ORDER BY use_count DESC', [
            '%'+word+'%',
        ]).then(results => {
            return results
        }).catch(err => {
            console.error(err)
        })

        let topUsers = []
        for (let i = 0; i < 10; i++) {
            if (i >= wordCounts.length) break

            topUsers.push(`#${i + 1} - <@!${wordCounts[i].author_id}> (${wordCounts[i].use_count}x)`)
        }

        msg.channel.send(`"${word}" leggyakoribb használói:\n\n` + topUsers.join('\n'))
    }
}