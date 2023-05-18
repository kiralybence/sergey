const fs = require('fs');
const Discord = require('discord.js');
const Valorant = require('./Valorant');

module.exports = class Sergey {
    static commands = [];
    static middlewares = [];
    static client = new Discord.Client();

    static init() {
        this.registerFunctionsGlobally();
        this.registerCommands();
        this.registerMiddlewares();
        this.registerClient();

        Valorant.init();
    }

    static registerCommands() {
        let commands = fs.readdirSync(__dirname + '/../commands');

        // Remove .js extension
        commands = commands.map(command => command.replace('.js', ''));

        // The base command should not be registered
        commands = commands.filter(command => command !== 'Command');

        // Convert command names into command instances
        commands = commands.map(command => new (require('../commands/' + command)));

        Sergey.commands = commands;
    }

    static registerMiddlewares() {
        let middlewares = fs.readdirSync(__dirname + '/../middlewares');

        // Remove .js extension
        middlewares = middlewares.map(middleware => middleware.replace('.js', ''));

        // The base middleware should not be registered
        middlewares = middlewares.filter(middleware => middleware !== 'Middleware');

        // Convert middleware names into middleware instances
        middlewares = middlewares.map(middleware => new (require('../middlewares/' + middleware)));

        Sergey.middlewares = middlewares;
    }

    static registerFunctionsGlobally() {
        fs.readdirSync(__dirname + '/../functions').forEach(fn => require('../functions/' + fn));
    }

    static registerClient() {
        Sergey.client.on('ready', () => {
            console.log(`Connected as ${Sergey.client.user.tag}`);
        });

        Sergey.client.on('message', msg => {
            Sergey.middlewares.forEach(middleware => {
                if (middleware.shouldRun(msg)) {
                    try {
                        middleware.run(msg);
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        });

        Sergey.client.login(process.env.TOKEN);
    }
};