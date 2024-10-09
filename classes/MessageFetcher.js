const Discord = require('discord.js');
const FetchedWord = require('./FetchedWord');
const Formatter = require('./Formatter');
const DB = require('./DB');
const Utils = require('./Utils');

module.exports = class MessageFetcher {
    /**
     * Fetch words from a message and save them in the database.
     *
     * @param {Discord.Message} message
     * @return {Promise<void>}
     */
    static async fromMessage(message) {
        if (await this.isAlreadyFethced(message.id)) {
            return;
        }

        // Get new words to be added
        let newWords = Formatter.removeFormatting(message.content)
            .toLowerCase()
            .split(' ')
            .map(word => word.trim())
            .filter(word => new FetchedWord({word}).canBeUsedToImitate());

        // Add new words to existing wordlist
        for (let i = 0; i < newWords.length; i++) {
            let prev_id = null;

            // If there is a previous word
            if (newWords[i - 1]) {
                // Search for it
                prev_id = await DB.query(`
                    select *
                    from fetched_words
                    where word = ?
                    order by id desc
                    limit 1
                `, [
                    newWords[i - 1],
                ]).then(results => results[0]?.id);
            }

            await DB.query(`
                insert into fetched_words (
                    word,
                    prev_id,
                    author_id,
                    message_id,
                    channel_id,
                    guild_id,
                    created_at
                ) values (?, ?, ?, ?, ?, ?, ?)
            `, [
                String(newWords[i]).substring(0, 255),
                prev_id,
                message.author.id,
                message.id,
                message.channel.id,
                message.guild.id,
                new Date(message.createdTimestamp),
            ]);
        }
    }

    /**
     * Fetch words from messages in a channel and save them in the database.
     *
     * @param {string} channelId
     * @return {Promise<void>}
     */
    static async fromChannel(channelId) {
        let channel = Utils.getChannel(channelId);
        let lastId;

        while (true) {
            const fetchedMessages = await channel.messages.fetch({
                limit: 100,
                ...(lastId && { before: lastId }),
            });

            // Add new
            for (const message of fetchedMessages.values()) {
                if (message.author.bot) {
                    continue;
                }

                await this.fromMessage(message);
            }

            // If there are no more messages left
            if (fetchedMessages.size === 0) {
                return;
            }

            lastId = fetchedMessages.lastKey();
        }
    }

    /**
     * Check if fetching messages is allowed in the channel.
     * 
     * @param {string} channelId 
     * @return {Promise<boolean>}
     */
    static async isFetchableChannel(channelId) {
        let results = await DB.query('select 1 from fetchable_channels where channel_id = ? and is_enabled = 1 limit 1', [channelId]);

        return results.length > 0;
    }

    /**
     * Check if a message has already been fetched before.
     * 
     * @param {string} messageId 
     * @returns {Promise<boolean>}
     */
    static async isAlreadyFethced(messageId) {
        let results = await DB.query('select 1 from fetched_words where message_id = ? limit 1', [messageId]);

        return results.length > 0;
    }
};