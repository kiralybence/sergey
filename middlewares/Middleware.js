module.exports = class Middleware {
    shouldRun(message) {
        return true;
    }

    async run(message) {
        throw 'No run action specified.';
    }
}