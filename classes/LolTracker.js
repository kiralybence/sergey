import axios from 'axios';
import Emote from './Emote.js';
import DB from './DB.js';
import Log from './Log.js';
import Sergey from './Sergey.js';

export default class LolTracker {
    static REFRESH_INTERVAL_SECONDS = 120;
    static RECENT_GAME_THRESHOLD_MINUTES = 10;

    /**
     * Initialize League of Legends tracker.
     *
     * @return {Promise<void>}
     */
    static async init() {
        setInterval(async () => {
            let users = await this.getTrackedUsers();

            for (let user of users) {
                try {
                    let puuid = await this.getPuuid(user);

                    if (!puuid) {
                        continue;
                    }

                    let match = await this.fetchLatestMatch(user, puuid);

                    if (!match) {
                        continue;
                    }

                    if (await this.isTrackedMatch(match.metadata.matchId, user.id)) {
                        continue;
                    }

                    await this.saveMatch(match, user.id);

                    // Notifications should only be sent if the match ended recently
                    if (Date.now() - match.info.gameEndTimestamp < this.RECENT_GAME_THRESHOLD_MINUTES * 60 * 1000) {
                        await this.sendNotifications(match, puuid);
                    }
                } catch (err) {
                    Log.error(err);
                }
            }
        }, this.REFRESH_INTERVAL_SECONDS * 1000);
    }

    /**
     * Return users from the database that should be tracked.
     *
     * @return {Promise<object[]>}
     */
    static async getTrackedUsers() {
        return await DB.query('select * from tracked_lol_users where is_enabled = 1');
    }

    /**
     * Return the latest match from the user's match history.
     *
     * @param {object} user
     * @param {string} puuid
     * @return {Promise<object[]|null>}
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
        }).catch(err => {
            Log.error(err);
        });

        let matchId = resp?.data?.[0] ?? null;

        if (!matchId) {
            return null;
        }

        resp = await axios.get(`https://${user.region}.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
            headers: {
                'X-Riot-Token': process.env.RIOT_API_TOKEN,
            },
        }).catch(err => {
            Log.error(err);
        });

        return resp?.data ?? null;
    }

    /**
     * Check if a match was already tracked.
     *
     * @param {string} matchId
     * @param {number} userId
     * @return {Promise<boolean>}
     */
    static async isTrackedMatch(matchId, userId) {
        let results = await DB.query('select * from tracked_lol_matches where match_id = :matchId and user_id = :userId', {
            matchId: matchId,
            userId: userId,
        });

        return results.length > 0;
    }

    /**
     * Save an untracked match to the database.
     *
     * @param {object} match
     * @param {number} userId
     * @return {Promise<void>}
     */
    static async saveMatch(match, userId) {
        await DB.query('insert into tracked_lol_matches (match_id, user_id) values (:matchId, :userId)', {
            matchId: match.metadata.matchId,
            userId: userId,
        });
    }

    /**
     * Send notifications about a match.
     *
     * @param {object} match
     * @param {string} puuid
     * @return {Promise<void>}
     */
    static async sendNotifications(match, puuid) {
        let participant = match.info.participants.find(participant => participant.puuid === puuid);

        if (!participant.win) {
            await this.sendLossNotification(participant);
        }

        if (participant.pentaKills > 0) {
            await this.sendPentakillNotification(participant);
        }
    }

    /**
     * Send a loss notification.
     *
     * @param {Object} participant
     * @return {Promise<void>}
     */
    static async sendLossNotification(participant) {
        let name = participant.riotIdGameName;
        let champ = participant.championName;
        let kills = participant.kills;
        let deaths = participant.deaths;
        let assists = participant.assists;

        let message = `${name} just lost a LoL game ${await Emote.get('KEKW', '😂')} (${champ} ${kills}/${deaths}/${assists})`;

        Sergey.client.channels.cache.get(process.env.LOL_TRACKER_NOTIFICATION_CHANNEL_ID).send(message);
    }

    /**
     * Send a pentakill notification.
     *
     * @param {object} participant
     * @return {Promise<void>}
     */
    static async sendPentakillNotification(participant) {
        let name = participant.riotIdGameName;
        let champ = participant.championName;

        let message = `${name} just did a pentakill with ${champ} ${await Emote.get('PogChimp', '😲')}`;

        Sergey.client.channels.cache.get(process.env.LOL_TRACKER_NOTIFICATION_CHANNEL_ID).send(message);
    }

    /**
     * Return the Riot PUUID of a user.
     * 
     * @param {object} user
     * @return {Promise<string|null>}
     */
    static async getPuuid(user) {
        if (user.puuid) {
            return user.puuid;
        }

        let resp = await axios.get(`https://${user.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${user.name}/${user.tag}`, {
            headers: {
                'X-Riot-Token': process.env.RIOT_API_TOKEN,
            },
        }).catch(err => {
            Log.error(err);
        });

        let puuid = resp?.data?.puuid ?? null;

        if (!puuid) {
            return null;
        }

        await DB.query('update tracked_lol_users set puuid = :puuid where id = :id', {
            puuid: puuid,
            id: user.id,
        });

        return puuid;
    }
}