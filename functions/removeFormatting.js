module.exports = () => {
    global.removeFormatting = (str) => {
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
    };
};