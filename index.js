require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

// Register functions globally
fs.readdirSync(__dirname + '/functions').forEach(fn => require('./functions/' + fn)())

const middlewares = getMiddlewares()

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
})

client.on('message', msg => {
    // Run middlewares
    middlewares.forEach(middleware => {
        if (middleware.shouldRun(msg)) {
            try {
                middleware.run(msg)
            } catch (err) {
                console.error(err)
            }
        }
    })
})

client.login(process.env.TOKEN)

// ---------------------------------------------------------------------------------------------------------------------

const Valorant = require('./classes/Valorant')

// Valorant.init(client);