const Middleware = require('./Middleware')

module.exports = class extends Middleware {
    async run(msg) {
        return undefined
    }
}