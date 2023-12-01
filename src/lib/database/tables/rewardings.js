const connection = require('../sql');

function discman_rewardings() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.rewardings (
            id BIGINT(20) AUTO_INCREMENT,
            userid VARCHAR(255),
            points INT(255),
            gainedPoints INT(20),
            inviteCode VARCHAR(255),
            usersJoined INT(20),
            last_date BIGINT(20),
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_rewardings }