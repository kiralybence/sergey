import Middleware from './Middleware.js';
import Log from '../classes/Log.js';
import Formatter from '../classes/Formatter.js';
import * as Discord from 'discord.js';

export default class LogToConsole extends Middleware {
    async run(message) {
        let breadcrumbs = message.channel.type === Discord.ChannelType.DM
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
}