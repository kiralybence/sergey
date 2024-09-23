module.exports = class Middleware {
    static async call(target, middlewares) {
        for (const middleware of middlewares) {
            if (middleware.shouldRun(target)) {
                await middleware.run(target);
            }
        }
    }
};