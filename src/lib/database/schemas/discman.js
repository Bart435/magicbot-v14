const connection = require('../sql');

function discman_database() {
    return new Promise((resolve, reject) => {
        const sql = `CREATE DATABASE IF NOT EXISTS discman`
        connection.query(sql, (err, results) => {
            if (err) reject(err)
            return results.warningCount == "0" ? resolve(0) : resolve(results)
        })
    })
}
module.exports = { discman_database }