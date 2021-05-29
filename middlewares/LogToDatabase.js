const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    shouldRun(msg) {
        // If content is not empty
        return super.shouldRun(msg) && msg.content
    }

    async run(msg) {
        // Get new words to be added
        let newWords = msg.content
            .split(' ')
            .map(word => String(word).toLowerCase())

        // Add new words to existing wordlist
        for (let i = 0; i < newWords.length; i++) {
            let prev_id = null

            // If there is a previous word
            if (newWords[i - 1]) {
                // Search for it
                prev_id = await queryPromise('SELECT * FROM words WHERE word = ? ORDER BY id DESC LIMIT 1', [
                    newWords[i - 1],
                ]).then(results => {
                    // Get the ID
                    if (results.length > 0) {
                        return results[0].id
                    } else {
                        // previous word failed to insert?
                    }
                }).catch(err => {
                    console.error(err)
                })
            }

            queryPromise('INSERT INTO words (word, prev_id, author_id, channel_id, created_at) VALUES (?, ?, ?, ?, ?)', [
                String(newWords[i]).substring(0, 255),
                prev_id,
                msg.author.id,
                msg.channel.id,
                new Date(msg.createdTimestamp),
            ])
        }
    }
}