const connection = require("../../lib/database/sql");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (!message.author.bot) return
        if (message.channelId == "1073985831213215764") {
            let array = []
            for (field of message.embeds[0].fields) {
                array.push(field.value)
            }
            const date = new Date()
            let sql = `SELECT * FROM discman.newplayers`
            if (array.length == 9)  sql = `INSERT INTO discman.newplayers (steamid, steamName, playerid, hwid, tribe, ip, date) VALUES ('${array[4]}', '${array[2]}', '${array[3]}', '${array[5]}', '${array[7]}', '${array[6]}', '${date.toLocaleString("eu")}')`

            if (array.length == 7)  sql = `INSERT INTO discman.newplayers (steamid, steamName, playerid, hwid, tribe, ip, date) VALUES ('${array[2]}', '${array[1]}', '0', '${array[3]}', '${array[5]}', '${array[4]}', '${date.toLocaleString("eu")}')`
            connection.query(sql, (err) => {
                if (err) throw err;
            })
        }
    },
};

