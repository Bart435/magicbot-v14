const connection = require('../sql');

function discman_admin() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.admin (
            id BIGINT(20) AUTO_INCREMENT,
            steamid VARCHAR(255),
            userid VARCHAR(255),
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_admin }