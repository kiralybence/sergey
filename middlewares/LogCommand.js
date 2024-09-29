const Middleware = require('./Middleware');
const DB = require('../classes/DB');

module.exports = class LogCommand extends Middleware {
    async run(interaction) {
        await DB.query(`
            insert into command_logs (
                command,
                options,
                user_id,
                channel_id,
                guild_id,
                used_at
            ) values (?, ?, ?, ?, ?, ?)
        `, [
            interaction.commandName,
            this.formatOptions(interaction),
            interaction.user.id,
            interaction.channel.id,
            interaction.guild.id,
            new Date(interaction.createdTimestamp),
        ]);
    }

    formatOptions(interaction) {
        if (interaction.options.data.length === 0) {
            return null;
        }

        let options = {};

        for (const option of interaction.options.data) {
            options[option.name] = option.value;
        }

        return JSON.stringify(options);
    }
};