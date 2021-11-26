const Command = require('./Command')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'blacklist',
            description: 'Blacklists a user or a keyword.',
            paramsRequired: 2,
            example: '!blacklist <type> <tagged-user|keyword>',
            ownerOnly: true,
        })
    }

    async run(msg) {
        const params = this.getParamArray(msg)
        let type = params.shift()

        switch (type) {
            case 'user':
                let user = params.shift()

                if (!isTaggedUser(user)) {
                    msg.reply('The user isn\'t tagged. Tag the user with @ and try again.')
                    return
                }

                let user_id = getIdOfTaggedUser(user)

                if (await isBlacklistedUser(user_id)) {
                    msg.reply('User is already blacklisted.')
                    return
                }

                queryPromise('INSERT INTO blacklisted_users (user_id) VALUES (?)', [
                    user_id
                ]).then(results => {
                    msg.reply('User successfully blacklisted.')
                }).catch(err => {
                    console.error(err)
                    msg.reply('Hiba történt 😡')
                })
                break

            case 'keyword':
                msg.reply('This feature is not implemented yet.')
                return
                // let keyword = params.join(' ')
                // break

            default:
                msg.reply('Invalid type.')
                break
        }
    }
}