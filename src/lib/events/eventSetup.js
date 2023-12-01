const connection = require('../database/sql');
function eventSetup(interaction, guildId, channelId, event) {
    const sql = `SELECT * FROM discman.posts WHERE guildid = "${guildId}" AND slug = "${event}"`
    connection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) return interaction.reply({ content: "This is already set up" })
        const sql2 = `INSERT INTO discman.posts (guildid, channelid, slug) VALUES ('${guildId}', '${channelId}', '${event}')`
        connection.query(sql2, (err, results) => {
            if (err) throw err;
            if (results) return interaction.reply({ content: "Succesfully set up" })
        })
    })
}
module.exports = { eventSetup }