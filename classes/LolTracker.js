const axios = require('axios');
const Emote = require('./Emote');
const Sergey = require('./Sergey');
const DB = require('./DB');
const Log = require('./Log');

module.exports = class LolTracker {
    /**
     * Initialize League of Legends tracker.
     *
     * @return {Promise<void>}
     */
    static async init() {
        let users = await LolTracker.getTrackedUsers();

        for (let user of users) {
            let puuid = await LolTracker.getPuuid(user);

            setInterval(async () => {
                try {
                    let match = await LolTracker.fetchLatestMatch(user, puuid);

                    if (!match) {
                        return;
                    }

                    if (await LolTracker.isTrackedMatch(match.metadata.matchId, user.id)) {
                        return;
                    }

                    await LolTracker.saveMatch(match, user.id);

                    // Notifications should only be sent if the match ended recently
                    if (Date.now() - match.info.gameEndTimestamp < 180000) {
                        await LolTracker.sendNotifications(match, puuid);
                    }
                } catch (err) {
                    Log.error(err);
                }
            }, 30000);
        }
    }

    /**
     * Return users from the database that should be tracked.
     *
     * @return {Promise<Object[]>}
     */
    static async getTrackedUsers() {
        return await DB.query('select * from tracked_lol_users where is_enabled = 1');
    }

    /**
     * Return the latest match from the user's match history.
     *
     * @param user {Object}
     * @param puuid {string}
     * @return {Promise<Object[]|null>}
     */
    static async fetchLatestMatch(user, puuid) {
        let resp = await axios.get(`https://${user.region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
            params: {
                start: 0,
                count: 1,
            },
            headers: {
                'X-Riot-Token': process.env.RIOT_API_TOKEN,
            },
        });

        let matchId = resp.data[0] ?? null;

        if (!matchId) {
            return null;
        }

        resp = await axios.get(`https://${user.region}.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
            headers: {
                'X-Riot-Token': process.env.RIOT_API_TOKEN,
            },
        });

        return resp.data;
    }

    /**
     * Check if a match was already tracked.
     *
     * @param matchId {string}
     * @param userId {Number}
     * @return {Promise<boolean>}
     */
    static async isTrackedMatch(matchId, userId) {
        let results = await DB.query('select * from tracked_lol_matches where match_id = ? and user_id = ?', [
            matchId,
            userId,
        ]);

        return results.length > 0;
    }

    /**
     * Save an untracked match to the database.
     *
     * @param match {Object}
     * @param userId {Number}
     */
    static async saveMatch(match, userId) {
        await DB.query('insert into tracked_lol_matches (match_id, user_id) values (?, ?)', [
            match.metadata.matchId,
            userId,
        ]);
    }

    /**
     * Send notifications about a match.
     *
     * @param match {Object}
     * @param puuid {string}
     */
    static async sendNotifications(match, puuid) {
        let participant = match.info.participants.find(participant => participant.puuid === puuid);

        if (!participant.win) {
            await LolTracker.sendLossNotification(participant);
        }

        if (participant.pentaKills > 0) {
            await LolTracker.sendPentakillNotification(participant);
        }
    }

    /**
     * Send a loss notification.
     *
     * @param participant {Object}
     */
    static async sendLossNotification(participant) {
        let name = participant.riotIdGameName;
        let champ = participant.championName;
        let kills = participant.kills;
        let deaths = participant.deaths;
        let assists = participant.assists;

        let message = `${name} just lost a LoL game ${await Emote.get('KEKW')} (${champ} ${kills}/${deaths}/${assists})`;

        Sergey.client.channels.cache.get(process.env.LOL_TRACKER_NOTIFICATION_CHANNEL_ID).send(message);
    }

    /**
     * Send a pentakill notification.
     *
     * @param participant {Object}
     */
    static async sendPentakillNotification(participant) {
        let name = participant.riotIdGameName;
        let champ = participant.championName;

        let message = `${name} just did a pentakill with ${champ} ${await Emote.get('PogChimp')}`;

        Sergey.client.channels.cache.get(process.env.LOL_TRACKER_NOTIFICATION_CHANNEL_ID).send(message);
    }

    /**
     * Return the Riot PUUID of a user.
     * 
     * @param user {Object}
     * @return {Promise<string>}
     */
    static async getPuuid(user) {
        let resp = await axios.get(`https://${user.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${user.name}/${user.tag}`, {
            headers: {
                'X-Riot-Token': process.env.RIOT_API_TOKEN,
            },
        });

        return resp.data.puuid;
    }
};