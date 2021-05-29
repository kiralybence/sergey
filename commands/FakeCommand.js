const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'fake'
        })
    }

    async run(msg) {
        const userTag = this.getParamString(msg)
        const author_id = userTag
            .replace('<@!', '')
            .replace('>', '')
        const starterWords = await getWordCountsOfAuthor(author_id, true)

        let fakeText = []
        let starterPtr = 0
        let currentWord = starterWords[starterPtr].word
        for (let i = 0; i < 100; i++) {
            if (currentWord) {
                let numOfTimesInArr = fakeText.filter(word => word === currentWord).length

                const isEmpty = !currentWord
                const isLink = currentWord.includes('http://') || currentWord.includes('https://')
                const isTag = currentWord.includes('<@')
                const isCommand = currentWord.includes('!')
                if (!(isEmpty || isLink || isTag || isCommand)) {
                    fakeText.push(currentWord)
                }

                // To avoid repeating patterns
                let topNextWords = await getTopNextsOfWordByAuthor(currentWord, author_id)
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