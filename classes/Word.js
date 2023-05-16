const dayjs = require('dayjs');
const Discord = require('discord.js');

module.exports = class Word {
    constructor(props) {
        this.id = props?.id;
        this.word = props?.word;
        this.prev_id = props?.prev_id;
        this.author_id = props?.author_id;
        this.created_at = props?.created_at;
    }

    /**
     * Return the most common word to start a sentence with.
     *
     * @param author_id {String}
     * @param offset {Number}
     * @param days {Number|null}
     * @return {Promise<Word>}
     */
    static async getStarterWord(author_id, offset = 0, days = null) {
        const minDate = days
            ? dayjs()
                .subtract(days, 'days')
                .tz(process.env.TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss')
            : '1970-01-01 00:00:00';

        await query(`set sql_mode=(select replace(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);

        return await query(`
            select *
            from words
            where author_id = ?
            and created_at >= ?
            and prev_id is null
            group by word
            order by count(*) desc
            limit 1
            offset ?
        `, [
            author_id,
            minDate,
            offset,
        ]).then(results => results.length > 0 ? new Word(results[0]) : null);
    }

    /**
     * Return the word that most often follows the current word.
     *
     * @param offset {Number}
     * @param days {Number|null}
     * @return {Promise<Word>}
     */
    async getNextFollowingWord(offset = 0, days = null) {
        const minDate = days
            ? dayjs()
                .subtract(days, 'days')
                .tz(process.env.TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss')
            : '1970-01-01 00:00:00'; // anything

        return await query(`
            select *
            from words
            where prev_id in (
                select id from words where word = ?
            )
            and author_id = ?
            and created_at >= ?
            group by word
            order by count(*) desc
            limit 1
            offset ?
        `, [
            this.word,
            this.author_id,
            minDate,
            offset,
        ]).then(results => results.length > 0 ? new Word(results[0]) : null);
    }

    /**
     * Check if the word is a valid URL.
     *
     * @return {boolean}
     */
    isUrl() {
        try {
            new URL(this.word);
        } catch (e) {
            return false;
        }

        return true;
    }

    /**
     * Check if the word is empty.
     *
     * @return {boolean}
     */
    isEmpty() {
        return !this.word;
    }

    /**
     * Check if the word is a Discord tag.
     *
     * @return {boolean}
     */
    isTag() {
        return this.word.startsWith('<@');
    }

    /**
     * Check if the word is a command.
     *
     * @return {boolean}
     */
    isCommand() {
        return this.word.startsWith('!');
    }

    /**
     * We don't want to include meaningless things in imitated messages (such as URLs or tags).
     *
     * @return {boolean}
     */
    canBeUsedToImitate() {
        return !(this.isEmpty() || this.isUrl() || this.isTag() || this.isCommand());
    }
};