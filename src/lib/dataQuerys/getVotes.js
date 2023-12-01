const connection = require('../database/sql');
const config = require("../../../config.json");

function get_votes(steamId, parentId) {
    return new Promise((resolve, reject) => {
        let sql = ``

        if (parentId == config.info.basicCategory) sql = `SELECT * FROM discman.votes10x WHERE steamid = '${steamId}'`
        if (parentId == config.info.boostedCategory)sql = `SELECT * FROM discman.votes WHERE steamid = '${steamId}'`
        connection.query(sql, (err, results) => {
            return err ? reject(err) : resolve(results)
        })
    })
}

module.exports = { get_votes }