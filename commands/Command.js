module.exports = class {
    constructor(args) {
        this.name = args.name
        this.description = args.description
        this.paramsRequired = args.paramsRequired || 0
        this.example = args.example || ('!' + args.name + ' <param>'.repeat(this.paramsRequired))
        this.ownerOnly = args.ownerOnly
    }

    shouldRun(msg) {
        let nameMatches = msg.content.startsWith('!' + this.name) // TODO: splitelve kéne === a legelső szóra, különben összeakadnak az ugyanolyan kezdetű commandok pl. !fetch és !fetchall
        let permissionMatches = this.ownerOnly ? msg.author.id === process.env.OWNER_DISCORD_USER_ID : true
        let hasEnoughParams = this.paramsRequired <= this.getParamArray(msg).length

        return nameMatches && permissionMatches && hasEnoughParams
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