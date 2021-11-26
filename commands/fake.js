const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'fake',
            description: 'Imitate someone\'s writing style.',
            paramsRequired: 1,
            example: '!fake <tagged-user> <days?>',
        })
    }

    async run(msg) {
        const userTag = this.getParamArray(msg)[0]
        const days = this.getParamArray(msg)[1] || null

        if (!isTaggedUser(userTag)) {
            msg.reply('The user isn\'t tagged. Tag the user with @ and try again.')
            return
        }

        const author_id = getIdOfTaggedUser(userTag)
        const starterWords = await getWordCountsOfAuthor(author_id, true, days)

        let fakeText = []
        let starterPtr = 0
        let currentWord = starterWords[starterPtr].word
        for (let i = 0; i < 100; i++) {
            if (currentWord) {
                let numOfTimesInArr = fakeText.filter(word => word === currentWord).length

                const isEmpty = !currentWord
                const isLink = currentWord.startsWith('http://') || currentWord.startsWith('https://')
                const isTag = currentWord.startsWith('<@')
                const isCommand = currentWord.startsWith('!')
                if (!(isEmpty || isLink || isTag || isCommand)) {
                    fakeText.push(currentWord)
                }

                // To avoid repeating patterns
                let topNextWords = await getTopNextsOfWordByAuthor(currentWord, author_id, days)
                currentWord = topNextWords[numOfTimesInArr] !== undefined
                    ? topNextWords[numOfTimesInArr].word
                    : null
            } else {
                // End of sentence

                // fakeText.push(' MONDAT VÉGE ')

                if (++starterPtr < starterWords.length) {
                    // Start a new sentence
                    currentWord = starterWords[starterPtr].word // new starter word
                } else {
                    // If there are no more starter words
                    break
                }
            }
        }

        fakeText = fakeText.join(' ')

        msg.channel.send(`"${fakeText}" - ${userTag}`)
    }
}