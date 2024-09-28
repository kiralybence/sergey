const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

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
        ];

        const starterFormatters = [
            '>>> ', // block quotes
            '> ', // block quotes
        ];

        for (const formatter of formatters) {
            str = str.replace(new RegExp('\\' + formatter, 'g'), '');
        }

        for (const formatter of starterFormatters) {
            if (str.startsWith(formatter)) {
                str = str.substring(formatter.length, str.length);
            }
        }

        str = str.replace(new RegExp('\\n', 'g'), ' ');

        return str;
    }
};