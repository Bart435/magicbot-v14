const { Invite } = require('discord.js');
const connection = require('../../lib/database/sql');

module.exports = {
    name: "inviteCreate",
    /**
     *
     * @param {Invite} invite
     */
    execute(invite, client) {
        if (invite.guild.id !== client.config.info.mainGuild) return
        connection.query(`INSERT INTO discman.invites (code, uses, inviterId, createdTimestamp, _expiresTimestamp) VALUES ('${invite.code}', ${invite.uses}, ${invite.inviterId}, ${invite.createdTimestamp}, ${invite.expiresTimestamp})`, (err) => {if (err) throw err})
    },
};

