const dayjs = require('dayjs');
const DB = require('./DB');

module.exports = class FetchedWord {
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
     * @return {Promise<FetchedWord>}
     */
    static async getStarterWord(author_id, offset = 0, days = null) {
        const minDate = days
            ? dayjs()
                .subtract(days, 'days')
                .tz(process.env.TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss')
            : '1970-01-01 00:00:00';

        await DB.query(`set sql_mode=(select replace(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);

        return await DB.query(`
            select *
            from fetched_words
            where author_id = ?
            and channel_id in (
                select channel_id from fetchable_channels where is_enabled = 1
            )
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
        ]).then(results => results.length > 0 ? new FetchedWord(results[0]) : null);
    }

    /**
     * Return the word that most often follows the current word.
     *
     * @param offset {Number}
     * @param days {Number|null}
     * @return {Promise<FetchedWord>}
     */
    async getNextFollowingWord(offset = 0, days = null) {
        const minDate = days
            ? dayjs()
                .subtract(days, 'days')
                .tz(process.env.TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss')
            : '1970-01-01 00:00:00'; // anything

        return await DB.query(`
            select *
            from fetched_words
            where prev_id in (
                select id from fetched_words where word = ?
            )
            and author_id = ?
            and channel_id in (
                select channel_id from fetchable_channels where is_enabled = 1
            )
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
        ]).then(results => results.length > 0 ? new FetchedWord(results[0]) : null);
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
        let prefixes = [
            '<@', // user
            '<#', // text channel
            '<#', // voice channel
            '<:', // emote
            '<a:', // animated emote
        ];

        return prefixes.some(prefix => this.word.startsWith(prefix));
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