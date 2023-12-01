const connection = require("../../lib/database/sql");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        // Catches
        if (message.author.bot) return
        if (message.guildId != client.config.info.mainGuild) return
        if (message.content.length < 3) return
        
        // set date
        const now = new Date().getTime()
        
        // deciding amount
        let amount = 1
        if (message.content.startsWith("https")) amount = 2

        // Spam protection
        const id = await new Promise((resolve, reject) => {
            connection.query(`SELECT last_date FROM discman.rewardings WHERE userid = ${message.author.id}`, (err, results) => {
                if (err) throw err
                if (results.length <= 0) return resolve('x')
                const difference = now - results[0].last_date
                if (difference > 20000) resolve(true)
                else return resolve(false)
            });
        })

        // Catch
        if (!id) return 

        // Create user
        if (id == 'x') {
            connection.query(`INSERT INTO discman.rewardings (userid, points, gainedPoints, last_date) VALUES ('${message.author.id}', 0, 0, ${now})`, (err, res) => {
                if (err) throw err
                if (res) return
            })

        }

        // Asign rewards to existing user
        if (id) {
            connection.query(`UPDATE discman.rewardings SET last_date = ${now}, points = points + 1, gainedPoints = gainedPoints + ${amount} WHERE userid = ${message.author.id}`, (err, res) => {
                if (err) throw err
                if (res) return
            })
        }
    },
};

