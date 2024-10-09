const Discord = require('discord.js');
module.exports = class Utils {
    /**
     * Generate a random number.
     *
     * @param {number} min Inclusive
     * @param {number} max Inclusive
     * @return {number}
     */
    static rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Get a random element from an array.
     *
     * @param {Array} arr
     * @return {*}
     */
    static randArr(arr) {
        if (arr.length === 0) {
            return null;
        }

        return arr[this.rand(0, arr.length - 1)];
    }

    /**
     * Get the channel instance with the given channel ID.
     * 
     * @param {string} channelId 
     * @return {Discord.Channel|null}
     */
    static getChannel(channelId) {
        // TODO: temporary solution
        const Sergey = require('../classes/Sergey');

        for (const guild of Sergey.client.guilds.cache.values()) {
            const channel = guild.channels.cache.get(channelId);
    
            if (channel) {
                return channel;
            }
        };

        return null;
    }
};