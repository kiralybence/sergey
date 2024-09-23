const Discord = require('discord.js');
module.exports = class Utils {
    /**
     * Generate a random number
     *
     * @param min Inclusive
     * @param max Inclusive
     */
    static rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Get a random element from an array
     *
     * @param arr
     */
    static randArr(arr) {
        if (arr.length === 0) {
            return null;
        }

        return arr[Utils.rand(0, arr.length - 1)];
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