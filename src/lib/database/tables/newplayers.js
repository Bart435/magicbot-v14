const connection = require('../sql');

function discman_newplayers() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.newplayers (
            id BIGINT(20) AUTO_INCREMENT,
            steamid VARCHAR(255),
            steamName VARCHAR(255),
            playerid VARCHAR(255),
            hwid VARCHAR(255),
            tribe VARCHAR(255),
            ip VARCHAR(255),
            date VARCHAR(255),
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_newplayers }