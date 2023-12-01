const connection = require('../database/sql');
const { EmbedBuilder, WebhookClient } = require('discord.js');
let errorEmbed = new EmbedBuilder().setColor("Red")
let succesEmbed = new EmbedBuilder().setColor("Green")

function autoUnmute(client) {
    connection.query(`SELECT * FROM discman.mutes WHERE active = 1`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            const discordid = results[i].userid
            const time = results[i].date
            const now = new Date().getTime();
            const MuteTime = new Date(time).getTime();
            const adjustedTime = MuteTime - now;
            if (adjustedTime < 0) removeMute(discordid, client)

        }
    });
}

async function removeMute(discordid, client) {
    const member = await client.guilds.cache.get(client.config.info.mainGuild).members.fetch(discordid);
    try {
        await member.roles.remove(client.config.muteSystem.roleId)

        connection.query(`UPDATE discman.mutes SET date = '0', admin_user = 'MagicBot', active = '0' WHERE userid = ${discordid}`, function (err, results) {
            if (err) throw err;
            if (!results) return interaction.reply({ embeds: [errorEmbed.setDescription("a error occured during performing of this command (adjustMute)")], ephemeral: true })
        })

        const webhookClient = new WebhookClient({ url: client.config.muteSystem.webhook });
        webhookClient.send({ embeds: [errorEmbed.setDescription(`<@${discordid}> Got unmuted`)] })
    } catch (error) {
        interaction.reply({ embeds: [errorEmbed.setDescription("Couldn't remove this role")], ephemeral: true })
    }
}

module.exports = { autoUnmute }

        