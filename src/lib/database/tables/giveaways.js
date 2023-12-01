const connection = require('../sql');

function discman_giveaways() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE TABLE IF NOT EXISTS discman.giveaways (
            id BIGINT(20) AUTO_INCREMENT,
            messageid VARCHAR(255),
            data JSON,
            primary key (id)
        )`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_giveaways }