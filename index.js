const Log = require('./classes/Log');
const DB = require('./classes/DB');
const Sergey = require('./classes/Sergey');
const LolTracker = require('./classes/LolTracker');

// Parse .env variables
require('dotenv').config();

// Initialize the logger
Log.init();

// Initialize the DB connection
DB.init();

// Start the bot
Sergey.init();

// Initialize the League of Legends tracker
if (process.env.RIOT_API_TOKEN) {
    LolTracker.init();
}