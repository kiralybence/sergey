module.exports = class Command {
    constructor(props) {
        this.name = props?.name;
        this.description = props?.description;
        this.paramsRequired = props?.paramsRequired ?? 0;
        this.example = props?.example ?? ('!' + props?.name + ' <param>'.repeat(this.paramsRequired));
        this.ownerOnly = props?.ownerOnly;
    }

    shouldRun(msg) {
        let nameMatches = msg.content.split(' ', 1).shift() === '!' + this.name;
        let permissionMatches = this.ownerOnly ? msg.author.id === process.env.OWNER_DISCORD_USER_ID : true;
        let hasEnoughParams = this.getParamArray(msg).length >= this.paramsRequired;

        return nameMatches && permissionMatches && hasEnoughParams;
    }

    getParamString(msg) {
        return msg.content.replace('!' + this.name, '').trim();
    }

    getParamArray(msg) {
        return this.getParamString(msg).split(' ').filter(msg => msg !== ''); // a filter azért kell, mert lehet olyan is, hogy "!img param1            param2"
    }

    async run(msg) {
        throw 'No run action specified.';
    }
};