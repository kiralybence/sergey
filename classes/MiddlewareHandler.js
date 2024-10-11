export default class MiddlewareHandler {
    static async call(target, middlewares) {
        for (const middleware of middlewares) {
            if (await middleware.shouldRun(target)) {
                await middleware.run(target);
            }
        }
    }
}