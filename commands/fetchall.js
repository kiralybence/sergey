const Command = require('./Command');
const Log = require('../classes/Log');

module.exports = class FetchallCommand extends Command {
    constructor() {
        super({
            name: 'fetchall',
            description: 'Export and store all messages from the channel.',
            ownerOnly: true,
        });
    }

    async run(msg) {
        console.time('!fetchall');
        console.log('Fetching all messages in: ' + msg.channel.name);

        let lastID;
        while (true) {
            const fetchedMessages = await msg.channel.messages.fetch({
                limit: 100,
                ...(lastID && { before: lastID }),
            });

            // Add new
            fetchedMessages.forEach(message => {
                if (message.author.bot) {
                    return;
                }

                Log.database(message);
            })

            // If there are no more messages left
            if (fetchedMessages.size === 0) {
                console.log('Done fetching messages in: ' + msg.channel.name);
                console.timeEnd('!fetchall');
                return;
            }

            lastID = fetchedMessages.lastKey();
        }
    }
};