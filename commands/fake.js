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
            // If there is a word currently selected
            if (currentWord) {
                // We keep track of how many times we've already used a certain word (with numofTimesInArr),
                // so the next time we'll pick a different one to avoid infinitely repeating patterns.
                let numOfTimesInArr = fakeText.filter(word => word === currentWord).length

                const isEmpty = !currentWord
                const isLink = currentWord.startsWith('http://') || currentWord.startsWith('https://')
                const isTag = currentWord.startsWith('<@')
                const isCommand = currentWord.startsWith('!')

                // We don't want to include meaningless things in the text (such as links or tags)
                if (!(isEmpty || isLink || isTag || isCommand)) {
                    fakeText.push(currentWord)
                }

                // Get the words that most often follow the current word
                let topNextWords = await getTopNextsOfWordByAuthor(currentWord, author_id, days)

                // If there are any
                currentWord = topNextWords[numOfTimesInArr] !== undefined
                    ? topNextWords[numOfTimesInArr].word // Make it the next word
                    : null // End the sentence
            }

            // End of sentence
            else {
                // If there are any more starter words left in the list
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