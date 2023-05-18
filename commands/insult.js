const Command = require('./Command');

module.exports = class InsultCommand extends Command {
    constructor() {
        super({
            name: 'insult',
            description: 'Insult someone.',
            paramsRequired: 1,
            example: '!insult <tagged-user>',
        });
    }

    async run(msg) {
        const userTag = this.getParamArray(msg)[0];

        if (!isTaggedUser(userTag)) {
            msg.reply('The user isn\'t tagged. Tag the user with @ and try again.');
            return;
        }

        let insults = await query('select * from insults');

        msg.channel.send(`${userTag} ${randArr(insults).message}`);
    }
};