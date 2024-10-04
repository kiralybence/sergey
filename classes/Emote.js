const DB = require('./DB');

module.exports = class Emote {
    static async get(name, fallback = null) {
        return (await DB.query('select * from emotes where name = ? limit 1', [name]))[0]?.tag ?? fallback;
    }
};