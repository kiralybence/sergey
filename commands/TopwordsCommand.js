const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'topwords'
        })
    }

    async run(msg) {
        const userTag = msg.content.substring(10)
        const author_id = userTag
            .replace('<@!', '')
            .replace('>', '')
        const wordCounts = await getWordCountsOfAuthor(author_id)

        let topWords = []
        for (let i = 0; i < 10; i++) {
            if (i >= wordCounts.length) break

            topWords.push(`#${i + 1} - "${wordCounts[i].word}" (${wordCounts[i].use_count}x)`)
        }

        msg.channel.send(`${userTag} leggyakrabban használt szavai:\n\n` + topWords.join('\n'))
    }
}