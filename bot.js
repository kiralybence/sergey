import * as dotenv from 'dotenv';
import Log from './classes/Log.js';
import DB from './classes/DB.js';
import Sergey from './classes/Sergey.js';

// Parse .env variables
dotenv.config();

// Initialize the logger
await Log.init();

// Initialize the DB connection
await DB.init();

// Start the bot
await Sergey.init();