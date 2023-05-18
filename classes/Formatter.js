const dayjs = require('dayjs');

module.exports = class Formatter {
    static formatTimestamp(timestamp) {
        return dayjs(timestamp)
            .tz(process.env.TIMEZONE)
            .format('YYYY-MM-DD HH:mm:ss');
    }

    static getFileNameFromUrl(url) {
        let result = new RegExp(/(?=\w+\.\w{3,4}$).+/).exec(url);

        return result?.[0];
    }

    /**
     * Return the user ID of a tagged user.
     *
     * @param {string} user Tagged user
     * @return {string|null} The tagged user's ID
     */
    static getIdOfTaggedUser(user) {
        if (!this.isTaggedUser(user)) {
            return null;
        }

        return user
            .replace('<@!', '')
            .replace('<@', '')
            .replace('>', '');
    }

    /**
     * Return if a string is a tagged user.
     *
     * @param {string} taggedUser
     * @return {boolean}
     */
    static isTaggedUser(taggedUser) {
        return taggedUser.startsWith('<@');
    }

    static removeAccents(str) {
        return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }

    static removeFormatting(str) {
        const formatters = [
            '*', // italics/bold
            '_', // italics/underline
            '~~', // strikethrough
            '||', // spoiler
            '`', // code blocks

            // TODO: these should only be removed if they're at the beginning of a row
            // '>>> ', // block quotes
            // '> ', // block quotes
        ];

        formatters.forEach(formatter => {
            str = str.replace(new RegExp('\\' + formatter, 'g'), '');
        });

        str = str.replace(new RegExp('\\n', 'g'), ' ');

        return str;
    }
};