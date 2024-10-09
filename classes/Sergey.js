const fs = require('fs');
const Discord = require('discord.js');
const Log = require('./Log');
const MessageScheduler = require('./MessageScheduler');
const LolTracker = require('./LolTracker');
const MiddlewareHandler = require('./MiddlewareHandler');
const LogToConsole = require('../middlewares/LogToConsole');
const FetchWords = require('../middlewares/FetchWords');
const AutoReact = require('../middlewares/AutoReact');
const AutoReply = require('../middlewares/AutoReply');
const HandleCommand = require('../middlewares/HandleCommand');
const LogCommand = require('../middlewares/LogCommand');

module.exports = class Sergey {
    static commands = [];
    static client = null;

    static init() {
        this.registerCommands();
        this.registerClient();
        MessageScheduler.init();

        if (process.env.RIOT_API_TOKEN) {
            LolTracker.init();
        }
    }

    static registerCommands() {
        let filenames = fs.readdirSync(__dirname + '/../commands');

        for (const filename of filenames) {
            // The base command should not be registered
            if (filename === 'Command.js') {
                continue;
            }

            // Convert filenames into command instances
            let command = new (require('../commands/' + filename))();

            this.commands.push(command);
        }

        const discordApi = new Discord.REST().setToken(process.env.TOKEN);

        discordApi.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), {
            body: this.commands.map(command => command.command),
        });
    }

    static registerClient() {
        this.client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildMessageReactions,
                Discord.GatewayIntentBits.GuildEmojisAndStickers,
            ],
        });

        this.client.on(Discord.Events.ClientReady, () => {
            Log.console(`Connected as ${this.client.user.tag}`);
        });

        this.client.on(Discord.Events.MessageCreate, async message => {
            try {
                await MiddlewareHandler.call(message, [
                    new LogToConsole(),
                    new FetchWords(),
                    new AutoReact(),
                    new AutoReply(),
                ]);
            } catch (err) {
                Log.error(err);
            }
        });

        this.client.on(Discord.Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            try {
                await MiddlewareHandler.call(interaction, [
                    new HandleCommand(),
                    new LogCommand(),
                ]);
            } catch (err) {
                Log.error(err);
            }
        });

        this.client.login(process.env.TOKEN);
    }
};