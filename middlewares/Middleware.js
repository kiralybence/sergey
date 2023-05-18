module.exports = class Middleware {
    shouldRun(msg) {
        return !msg.author.bot;
    }

    async run(msg) {
        throw 'No run action specified.';
    }
}