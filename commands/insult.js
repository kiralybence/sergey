const Command = require('./Command');
const Formatter = require('../classes/Formatter');
const DB = require('../classes/DB');
const Utils = require('../classes/Utils');

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

        if (!Formatter.isTaggedUser(userTag)) {
            msg.reply('The user isn\'t tagged. Tag the user with @ and try again.');
            return;
        }

        let insults = await DB.query('select * from insults');

        msg.channel.send(`${userTag} ${Utils.randArr(insults).message}`);
    }
};