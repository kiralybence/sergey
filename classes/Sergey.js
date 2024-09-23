const fs = require('fs');
const Discord = require('discord.js');
const Valorant = require('./Valorant');
const winston = require('winston');
const Formatter = require('./Formatter');
const Middleware = require('./Middleware');
const LogToConsole = require('../middlewares/LogToConsole');
const FetchWords = require('../middlewares/FetchWords');
const AutoReact = require('../middlewares/AutoReact');
const HandleCommand = require('../middlewares/HandleCommand');
require('winston-daily-rotate-file');

module.exports = class Sergey {
    static commands = [];
    static client = null;
    static logger = null;

    static init() {
        this.registerCommands();
        this.registerLogger();
        this.registerClient();

        // Valorant.init();
    }

    static registerCommands() {
        fs.readdirSync(__dirname + '/../commands')
            .forEach(filename => {
                // The base command should not be registered
                if (
                    filename === 'Command.js'
                    || filename === 'fetchall.js' // temp
                    || filename === 'valorant.js' // temp
                ) {
                    return;
                }

                // Convert filenames into command instances
                let command = new (require('../commands/' + filename))();

                Sergey.commands.push(command);
            });

        const discordApi = new Discord.REST().setToken(process.env.TOKEN);

        discordApi.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), {
            body: this.commands.map(command => command.command),
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

        Sergey.client.on(Discord.Events.ClientReady, () => {
            console.log(`Connected as ${Sergey.client.user.tag}`);
        });

        Sergey.client.on(Discord.Events.MessageCreate, async message => {
            try {
                await Middleware.call(message, [
                    new LogToConsole(),
                    new FetchWords(),
                    new AutoReact(),
                ]);
            } catch (err) {
                console.error(err);
                
                Sergey.logger.log({
                    level: 'error',
                    message: err.stack || err.message || err,
                });
            }
        });

        Sergey.client.on(Discord.Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            try {
                await Middleware.call(interaction, [
                    new HandleCommand(),
                ]);
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