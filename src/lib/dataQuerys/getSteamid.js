const connection = require("../database/sql");

function get_steamid(discordid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CAST(steamid AS CHAR) as steamid FROM WdiscordIntegrator.discord_integration_players WHERE DiscordID = ${discordid}`, (err, results) => {
            if (results.length <= 0) return resolve(false)
            return err ? reject(err) : resolve(results[0].steamid)
        })
    })
}

module.exports = { get_steamid }