module.exports = class MiddlewareHandler {
    static async call(target, middlewares) {
        for (const middleware of middlewares) {
            if (middleware.shouldRun(target)) {
                await middleware.run(target);
            }
        }
    }
};