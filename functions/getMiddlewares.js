const fs = require('fs');

module.exports = () => {
    global.getMiddlewares = () => {
        let middlewares = fs.readdirSync(__dirname + '/../middlewares');

        // Remove .js extension
        middlewares = middlewares.map(middleware => middleware.replace('.js', ''));

        // The base middleware should not be registered
        middlewares = middlewares.filter(middleware => middleware !== 'Middleware');

        // Convert middleware names into middleware instances
        middlewares = middlewares.map(middleware => new (require('../middlewares/' + middleware)));

        return middlewares;
    };
};