const Command = require('./Command');
const Emote = require('../classes/Emote');

module.exports = class RollCommand extends Command {
    constructor() {
        super({
            name: 'roll',
            description: 'Gamble against the bot.',
        });
    }

    async run(msg) {
        let userPoints = rand(1, 100);
        let botPoints = rand(1, 100);
        let result;

        if (userPoints < botPoints) {
            result = `Winner: Sergey ${Emote.KEKWDISCO}`;
        } else if (userPoints > botPoints) {
            result = `Winner: ${msg.author.username} 😡`;
        } else if (userPoints === botPoints) {
            result = Emote['4Weird'];
        } else {
            result = 'Ennek az üzenetnek soha nem szabadna látszódnia.';
        }

        msg.channel.send(`${msg.author.username}: ${userPoints}\nSergey: ${botPoints}\n\n${result}`);
    }
};