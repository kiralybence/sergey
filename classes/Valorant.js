const axios = require('axios');
const Emote = require('../classes/Emote');
const DiscordChannel = require('../classes/DiscordChannel');
const Discord = require('discord.js');

module.exports = class Valorant {
    /**
     * Initialize everything that is Valorant related.
     *
     * @param client {Discord.Client}
     * @return {Promise<void>}
     */
    static async init(client) {
        let users = await Valorant.getTrackedUsers();

        users.forEach(user => {
            setInterval(() => {
                try {
                    Valorant.refresh(user);
                } catch (err) {
                    console.error(err);
                }
            }, 60000);

            setInterval(() => {
                try {
                    Valorant.sendLossNotifications(user, client);
                } catch (err) {
                    console.error(err);
                }
            }, 10000);
        });
    }

    /**
     * Return users from the database that should be tracked.
     *
     * @return {Promise<Object[]>}
     */
    static getTrackedUsers() {
        return query('select * from tracked_valorant_users')
            .then(users => users);
    }

    /**
     * Refresh the user's match history on op.gg.
     *
     * @param user {Object}
     */
    static refresh(user) {
        axios.get('https://valorant.op.gg/api/renew', {
            params: {
                gameName: user.name,
                tagLine: user.tag,
            },
        });
    }

    /**
     * Return untracked matches from the user's match history on op.gg.
     *
     * @param user {Object}
     * @return {Promise<Object[]>}
     */
    static fetchUntrackedMatches(user) {
        return axios.get('https://valorant.op.gg/api/player', {
            params: {
                gameName: user.name,
                tagLine: user.tag,
            },
        })
        .then(resp => resp.data)
        .then(resp => {
            return this.filterUntrackedMatches(resp.recentGames.matches, user.id);
        });
    }

    /**
     * Check if the user has any new losses (and send a message in chat if there are).
     *
     * @param user {Object}
     * @param client {Discord.Client}
     */
    static async sendLossNotifications(user, client) {
        let matches = await this.fetchUntrackedMatches(user);

        matches.forEach(match => {
            this.saveMatch(match, user.id);

            if (!match.won) {
                this.sendLossMessage(match, user, client);
            }
        });
    }

    /**
     * Input an array of matches, and return untracked ones.
     *
     * @param matches {Object[]}
     * @param userId {Number}
     * @return {Promise<Object[]>}
     */
    static filterUntrackedMatches(matches, userId) {
        return query('select match_id from valorant_games where match_id in (?) and user_id = ?', [
            matches.map(match => match.matchId),
            userId,
        ])
        .then(rows => rows.map(match => match.match_id))
        .then(trackedMatchIds => {
            return matches.filter(match => !trackedMatchIds.includes(match.matchId));
        });
    }

    /**
     * Save an untracked match to the database.
     *
     * @param match {Object}
     * @param userId {Number}
     */
    static saveMatch(match, userId) {
        query('insert into valorant_games (match_id, match_data, user_id) values (?, ?, ?)', [
            match.matchId,
            JSON.stringify(match),
            userId,
        ]);
    }

    /**
     * Prepare a message for notifications about losses.
     *
     * @param match {Object}
     * @param user {Object}
     * @return {string}
     */
    static buildLossMessage(match, user) {
        return `${user.displayed_name.toUpperCase()} ÚJ LOSE ${Emote.KEKW} (${match.roundResults}) - ${match.character.name} (${match.kda} KDA)\n`;
    }

    /**
     * Send a loss notification to a channel.
     *
     * @param match {Object}
     * @param user {Object}
     * @param client {Discord.Client}
     */
    static sendLossMessage(match, user, client) {
        let message = this.buildLossMessage(match, user);

        client.channels.cache.get(DiscordChannel.weebsChat).send(message);
        // console.log(message);
    }
};