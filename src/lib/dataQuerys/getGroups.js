const connection = require('../database/sql');
const config = require("../../../config.json")
function get_groups(steamId, parentId) {
    return new Promise((resolve, reject) => {
        let sql = ``

        if (parentId == config.info.basicCategory) sql = `SELECT * FROM Wpermissions10x.Players WHERE SteamId = ${steamId}`
        if (parentId == config.info.boostedCategory)sql = `SELECT * FROM Wpermissions.Players WHERE SteamId = ${steamId}`
        else return resolve(false)
        connection.query(sql, (err, results) => {
            return err ? reject(err) : resolve(results)
        })
    })
}

module.exports = { get_groups }