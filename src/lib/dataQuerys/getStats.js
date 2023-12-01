const connection = require('../database/sql');

function get_stats(steamId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Wshop.advanceachievements_playerdata WHERE SteamId = ${steamId}`
        connection.query(sql, (err, results) => {
            return err ? reject(err) : resolve(results)
        })
    })
}

module.exports = { get_stats }