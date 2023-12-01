const connection = require('../database/sql');

function get_tickets(channel) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM discman.tickets WHERE channelid = '${channel.id}'`
        connection.query(sql, (err, results) => {
            return err ? reject(err) : resolve(results)
        })
    })
}

module.exports = { get_tickets }