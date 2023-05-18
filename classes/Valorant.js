const axios = require('axios');
const Emote = require('./Emote');
const Sergey = require('./Sergey');

module.exports = class Valorant {
    /**
     * Initialize everything that is Valorant related.
     *
     * @return {Promise<void>}
     */
    static async init() {
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
                    Valorant.sendLossNotifications(user);
                } catch (err) {
                    console.error(err);
                }
            }, 10000);
        });

        // TODO: FIX
        console.log(Sergey.commands);
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
     */
    static async sendLossNotifications(user) {
        let matches = await this.fetchUntrackedMatches(user);

        matches.forEach(match => {
            this.saveMatch(match, user.id);

            if (!match.won) {
                this.sendLossMessage(match, user);
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
     */
    static sendLossMessage(match, user) {
        let message = this.buildLossMessage(match, user);

        Sergey.client.channels.cache.get(process.env.MAIN_CHANNEL_ID).send(message);
        // console.log(message);
    }
};