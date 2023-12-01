const connection = require('../database/sql');
const config = require("../../../config.json");

function get_points(steamId, parentId) {
    return new Promise((resolve, reject) => {
        let sql = ``

        if (parentId == config.info.basicCategory) sql = `SELECT * FROM wshop10x.arkshopplayers WHERE SteamId = ${steamId}`
        if (parentId == config.info.boostedCategory)sql = `SELECT * FROM wshop.arkshopplayers WHERE SteamId = ${steamId}`

        connection.query(sql, (err, results) => {
            return err ? reject(err) : resolve(results)
        })
    })
}

module.exports = { get_points }