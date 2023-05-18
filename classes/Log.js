const Discord = require('discord.js');
const Word = require('./Word');
const Formatter = require('./Formatter');

module.exports = class Log {
    /**
     * Log a message to the database.
     *
     * @param msg {Discord.Message}
     * @return {Promise<void>}
     */
    static async database(msg) {
        // Get new words to be added
        let newWords = Formatter.removeFormatting(msg.content)
            .toLowerCase()
            .split(' ')
            .map(word => word.trim())
            .filter(word => new Word({word}).canBeUsedToImitate());

        // Add new words to existing wordlist
        for (let i = 0; i < newWords.length; i++) {
            let prev_id = null;

            // If there is a previous word
            if (newWords[i - 1]) {
                // Search for it
                prev_id = await query(`
                    select *
                    from words
                    where word = ?
                    order by id desc
                    limit 1
                `, [
                    newWords[i - 1],
                ]).then(results => results?.[0]?.id);
            }

            await query('insert into words (word, prev_id, author_id, created_at) values (?, ?, ?, ?)', [
                String(newWords[i]).substring(0, 255),
                prev_id,
                msg.author.id,
                new Date(msg.createdTimestamp),
            ]);
        }
    }

    /**
     * Log a message to the console.
     *
     * @param msg {Discord.Message}
     * @return {void}
     */
    static console(msg) {
        console.log(`[${Formatter.formatTimestamp(msg.createdTimestamp)}] ${msg.author.username}: ${Formatter.removeFormatting(msg.content)}`);
    }
};