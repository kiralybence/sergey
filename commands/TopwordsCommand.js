const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'topwords',
            description: 'Check the most frequently used words of a user.',
            paramsRequired: 1,
        })
    }

    async run(msg) {
        const userTag = this.getParamString(msg)
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