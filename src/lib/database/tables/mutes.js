const connection = require('../sql');

function discman_mutes() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.mutes (
            id BIGINT(20) AUTO_INCREMENT,
            userid VARCHAR(255),
            guildid VARCHAR(255),
            admin_user VARCHAR(255),
            reason VARCHAR(255),
            date VARCHAR(255),
            active TINYINT(10),
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_mutes }