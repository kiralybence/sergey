const fs = require('fs');
const Discord = require('discord.js');
const Valorant = require('./Valorant');
const winston = require('winston');
const Formatter = require('./Formatter');
require('winston-daily-rotate-file');

module.exports = class Sergey {
    static commands = [];
    static middlewares = [];
    static client = null;
    static logger = null;

    static init() {
        this.registerCommands();
        this.registerMiddlewares();
        this.registerLogger();
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

    static registerClient() {
        Sergey.client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildMessageReactions,
                Discord.GatewayIntentBits.GuildEmojisAndStickers,
              ],
        });

        Sergey.client.on('ready', () => {
            console.log(`Connected as ${Sergey.client.user.tag}`);
        });

        Sergey.client.on('messageCreate', async msg => {
            try {
                for (const middleware of Sergey.middlewares) {
                    if (middleware.shouldRun(msg)) {
                        await middleware.run(msg);
                    }
                }
            } catch (err) {
                console.error(err);
                
                Sergey.logger.log({
                    level: 'error',
                    message: err.stack || err.message || err,
                });
            }
        });

        Sergey.client.login(process.env.TOKEN);
    }

    static registerLogger() {
        Sergey.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: Formatter.formatTimestamp,
                }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                }),
            ),
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: 'logs/%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                }),
            ],
        });
    }
};