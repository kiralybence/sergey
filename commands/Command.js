module.exports = class {
    constructor(args) {
        this.name = args.name
        this.paramsRequired = args.paramsRequired || 0
    }

    shouldRun(msg) {
        let nameMatches = msg.content.toLowerCase().startsWith('!' + this.name)
        let hasEnoughParams = this.paramsRequired <= this.getParamArray(msg).length

        return nameMatches && hasEnoughParams
    }

    getParamString(msg) {
        return msg.content.replace('!' + this.name, '').trim()
    }

    getParamArray(msg) {
        return this.getParamString(msg).split(' ').filter(msg => msg !== '')
    }

    async run(msg) {
        throw 'No run action specified.'
    }
}