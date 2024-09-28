const fs = require('fs');
const Discord = require('discord.js');
const Log = require('./Log');
const MiddlewareHandler = require('./MiddlewareHandler');
const LogToConsole = require('../middlewares/LogToConsole');
const FetchWords = require('../middlewares/FetchWords');
const AutoReact = require('../middlewares/AutoReact');
const AutoReply = require('../middlewares/AutoReply');
const HandleCommand = require('../middlewares/HandleCommand');

module.exports = class Sergey {
    static commands = [];
    static client = null;

    static init() {
        this.registerCommands();
        this.registerClient();
    }

    static registerCommands() {
        let filenames = fs.readdirSync(__dirname + '/../commands');

        for (const filename of filenames) {
            // The base command should not be registered
            if (
                filename === 'Command.js'
                || filename === 'valorant.js' // temp
            ) {
                continue;
            }

            // Convert filenames into command instances
            let command = new (require('../commands/' + filename))();

            Sergey.commands.push(command);
        }

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
            Log.console(`Connected as ${Sergey.client.user.tag}`);
        });

        Sergey.client.on(Discord.Events.MessageCreate, async message => {
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

        Sergey.client.on(Discord.Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            try {
                await MiddlewareHandler.call(interaction, [
                    new HandleCommand(),
                ]);
            } catch (err) {
                Log.error(err);
            }
        });

        Sergey.client.login(process.env.TOKEN);
    }
};