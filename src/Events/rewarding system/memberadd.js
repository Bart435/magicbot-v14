const { GuildMember } = require('discord.js')
const { comparing_invites } = require("../../lib/systems/invitesSystem");
const connection = require("../../lib/database/sql");

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {GuildMember} member
     */
    async execute(member, client) {
        // Check who invited him
        comparing_invites(client)

        // Check if he is already in the database if not insert him
        connection.query(`SELECT last_date FROM discman.rewardings WHERE userid = ${member.id}`, (err, results) => {
            if (err) throw err
            if (results.length <= 0) {
                const now = new Date().getTime()
                connection.query(`INSERT INTO discman.rewardings (userid, points, gainedPoints, last_date) VALUES ('${member.id}', 0, 0, ${now})`, (err, res) => {
                    if (err) throw err
                    if (res) return
                })
            }
        });
        
    },
};
