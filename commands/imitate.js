const Command = require('./Command');
const Imitator = require('../classes/Imitator');
const Formatter = require('../classes/Formatter');

module.exports = class ImitateCommand extends Command {
    constructor() {
        super({
            name: 'imitate',
            description: 'Imitate someone\'s writing style.',
            paramsRequired: 1,
            example: '!imitate <tagged-user> <days?>',
        });
    }

    async run(msg) {
        let params = this.getParamArray(msg);
        let userTag = params[0];
        let days = params?.[1];

        if (!Formatter.isTaggedUser(userTag)) {
            msg.reply('The user isn\'t tagged. Tag the user with @ and try again.');
            return;
        }

        let author_id = Formatter.getIdOfTaggedUser(userTag);
        let imitator = new Imitator(author_id, days);
        let fakeText = await imitator.imitate();

        msg.channel.send(`"${fakeText}" - ${userTag}`);
    }
};