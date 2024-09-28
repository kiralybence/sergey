const Middleware = require('./Middleware');
const Log = require('../classes/Log');
const Formatter = require('../classes/Formatter');

module.exports = class LogToConsole extends Middleware {
    async run(message) {
        let breadcrumbs = message.channel.type === 'dm'
            ? [
                'DM',
                (message.author.globalName || message.author.username),
            ]
            : [
                message.guild.name,
                '#' + message.channel.name,
                (message.author.globalName || message.author.username),
            ];

        let text = `${breadcrumbs.join(' > ')}: ${Formatter.removeFormatting(message.content)}`;

        Log.console(text);
    }
};