const { EmbedBuilder } = require('discord.js');
const connection = require('../database/sql');

async function createMessage(channelID, client, guildId, MsgKey) {
    const temp = new EmbedBuilder().setDescription("Embed coming soon").setColor(client.config.info.embed.color);
    const channel = client.channels.cache.get(channelID);
    const msg = await channel.send({ embeds: [temp] });
    const sqlQuery = `UPDATE discman.posts SET messageid = ${msg.id} WHERE channelid = ${channelID} AND guildid = ${guildId} AND slug = "${MsgKey}"`
    connection.query(sqlQuery, function (err, results) {
        if (err) console.error(err)
        if (!results) console.error("MessageID not succesfully changed")
    })
}

module.exports = { createMessage };