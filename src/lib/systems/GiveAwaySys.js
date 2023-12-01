const { GiveawaysManager } = require('discord-giveaways');
const connection = require('../database/sql');

module.exports = (client) => {
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            return new Promise((resolve, reject) => {
                connection.query('SELECT data FROM discman.giveaways', (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    const giveaways = res.map((row) =>
                        JSON.parse(row.data, (_, v) =>
                            typeof v === 'string' && /BigInt\("(-?\d+)"\)/.test(v) ? eval(v) : v
                        )
                    );
                    resolve(giveaways);
                });
            });
        }

        async saveGiveaway(messageId, giveawayData) {
            return new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO discman.giveaways (messageid, data) VALUES (?,?)',
                    [messageId, JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v))],
                    (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(true);
                    }
                );
            });
        }

        async editGiveaway(messageId, giveawayData) {
            return new Promise((resolve, reject) => {
                connection.query(
                    'UPDATE discman.giveaways SET data = ? WHERE messageid = ?',
                    [JSON.stringify(giveawayData, (_, v) => (typeof v === 'bigint' ? `BigInt("${v}")` : v)), messageId],
                    (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(true);
                    }
                );
            });
        }

        async deleteGiveaway(messageId) {
            return new Promise((resolve, reject) => {
                connection.query('DELETE FROM discman.giveaways WHERE messageid = ?', messageId, (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(true);
                });
            });
        }
    };

    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: '#008000',
            embedColorEnd: '#FF0000',
            reaction: '🎉'
        }
    });

    client.giveawaysManager = manager;
}