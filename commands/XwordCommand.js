const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'xword',
            description: 'Get a random word starting with a certain letter.',
        })
    }

    shouldRun(msg) {
        // TODO: this should contain the permissionMatches and hasEnoughParams checkings (without duplicating code)
        return this.getValidLetter(msg)
    }

    async run(msg) {
        let randomWords = await queryPromise('SELECT * FROM x_words WHERE word LIKE ?', [
            this.getValidLetter(msg) + '%',
        ])

        if (randomWords.length === 0) {
            msg.reply('Nincs ilyen betűs szó 😡')
            return
        }

        msg.reply(randArr(randomWords).word)
    }

    getValidLetter(msg) {
        const regex = new RegExp(/!(.*?)word/gi)
        const alphabet = [
            'a', 'á', 'b', 'c', 'cs', 'd', 'dz', 'dzs', 'e', 'é', 'f', 'g',
            'gy', 'h', 'i', 'í', 'j', 'k', 'l', 'ly', 'm', 'n', 'ny', 'o',
            'ó', 'ö', 'ő', 'p', 'q', 'r', 's', 'sz', 't', 'ty', 'u', 'ú',
            'ü', 'ű', 'v', 'w', 'x', 'y', 'z', 'zs'
        ]

        let found = msg.content.split(' ')
            // Swap each word with the valid letter found in them
            .map(word => {
                let letter = regex.exec(word.toLowerCase())

                return letter && alphabet.includes(letter[1])
                    ? letter[1]
                    : null
            })
            // Remove empty entries
            .filter(letter => letter)

        return found.length > 0
            ? found[0]
            : null
    }
}