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

        // Valorant.init();
    }

    static registerCommands() {
        fs.readdirSync(__dirname + '/../commands')
            .forEach(command => {
                // The base command should not be registered
                if (command === 'Command.js') {
                    return;
                }

                // Convert command names into command instances
                command = new (require('../commands/' + command));

                Sergey.commands.push(command);
            });
    }

    static registerMiddlewares() {
        fs.readdirSync(__dirname + '/../middlewares')
            .forEach(middleware => {
                // The base middleware should not be registered
                if (middleware === 'Middleware.js') {
                    return;
                }

                // Convert middleware names into middleware instances
                middleware = new (require('../middlewares/' + middleware));

                Sergey.middlewares.push(middleware);
            });
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