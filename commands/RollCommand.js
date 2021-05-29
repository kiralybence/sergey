const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'roll'
        })
    }

    async run(msg) {
        let userPoints = rand(1, 100)
        let botPoints = rand(1, 100)
        let result

        if (userPoints < botPoints) {
            result = 'Winner: Sergey <a:kekwdisco:835484310051487754>'
        } else if (userPoints > botPoints) {
            result = `Winner: ${msg.author.username} 😡`
        } else if (userPoints === botPoints) {
            result = '<:4Weird:792111149092831232>'
        } else {
            result = 'Ennek az üzenetnek soha nem szabadna látszódnia.'
        }

        msg.channel.send(`${msg.author.username}: ${userPoints}\nSergey: ${botPoints}\n\n${result}`)
    }
}