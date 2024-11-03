export default class Middleware {
    shouldRun(message) {
        return true;
    }

    async run(message) {
        throw new Error('No run action specified.');
    }
}