const DB = require('./classes/DB');
const Sergey = require('./classes/Sergey');

// Parse .env variables
require('dotenv').config();

// Initialize the DB connection
DB.init();

// Start the bot
Sergey.init();