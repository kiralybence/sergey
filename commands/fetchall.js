const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'fetchall',
            description: 'Export and store all messages from the channel.',
            ownerOnly: true,
        })
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
                // TODO: shouldBeLogged() to check if message isn't from a bot, isn't a command etc.
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