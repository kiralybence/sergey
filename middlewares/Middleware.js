export default class Middleware {
    shouldRun(target) {
        return true;
    }

    async run(target) {
        throw new Error('No run action specified.');
    }
}