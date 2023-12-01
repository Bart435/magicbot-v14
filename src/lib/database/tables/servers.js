const connection = require('../sql');

function discman_servers() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.servers (
            id BIGINT(20) AUTO_INCREMENT,
            slug VARCHAR(255),
            apikey VARCHAR(255),
            apiurl VARCHAR(255),
            voteurl VARCHAR(255),
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_servers }