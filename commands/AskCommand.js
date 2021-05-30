const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'ask',
            description: 'Ask the bot a question.',
            paramsRequired: 1,
        })
    }

    async run(msg) {
        const question = this.getParamString(msg).toLowerCase()
        let answer = []

        if (question.includes('hello')) {
            answer.push('hello')
        }

        if (question.includes('why')) {
            answer.push('i don\'t know')
        }

        if (question.includes('are you')) {
            answer.push('no')
        }

        if (question.includes('do you')) {
            answer.push('no')
        }

        if (question.includes('what')) {
            answer.push('i don\'t know')
        }

        if (question.includes('how to')) {
            answer.push('https://www.google.com/search?q=' + question.replace(/ /g, '+'))
        }

        msg.channel.send(answer.join('\n'))
    }
}