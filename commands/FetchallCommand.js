const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'fetchall'
        })
    }

    shouldRun(msg) {
        return super.shouldRun(msg) && msg.author.id === process.env.OWNER_DISCORD_USER_ID
    }

    async run(msg) {
        console.log('Fetching all messages in: ' + msg.channel.name)

        // Delete previous logs of this channnel
        queryPromise('DELETE FROM words WHERE channel_id = ?', [
            msg.channel.id,
        ])

        let lastID
        while (true) {
            const fetchedMessages = await msg.channel.messages.fetch({
                limit: 100,
                ...(lastID && { before: lastID }),
            })

            // Add new
            fetchedMessages.forEach(message => {
                logMsgToDb(message)
            })

            // If there are no more messages left
            if (fetchedMessages.size === 0) {
                console.log('Done fetching messages in: ' + msg.channel.name)
                return
            }

            lastID = fetchedMessages.lastKey()
        }
    }
}