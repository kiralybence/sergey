module.exports = class {
    constructor(args) {
        this.name = args.name
    }

    shouldRun(msg) {
        return msg.content.toLowerCase().includes('!' + this.name)
    }

    getParamString(msg) {
        return msg.content.replace('!' + this.name, '').trim()
    }

    getParamArray(msg) {
        return this.getParamString(msg).split(' ')
    }

    async run(msg) {
        throw 'No run action specified.'
    }
}