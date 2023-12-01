const connection = require('../sql');

function discman_tickets() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.tickets (
            id BIGINT(20) AUTO_INCREMENT,
            userid VARCHAR(255),
            type VARCHAR(255),
            channelid VARCHAR(255),
            guildid VARCHAR(255),
            closed TINYINT(1),
            closed_by VARCHAR(255),
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_tickets }