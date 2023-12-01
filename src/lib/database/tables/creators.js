const connection = require('../sql');

function discman_creators() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.creators (
            id BIGINT(20) AUTO_INCREMENT,
            userid VARCHAR(255),
            channelId VARCHAR(255),
            channelURL VARCHAR(255),
            latestVideoId VARCHAR(255),
            start_timestamp BIGINT(20),
            end_timestamp BIGINT(20),
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_creators }