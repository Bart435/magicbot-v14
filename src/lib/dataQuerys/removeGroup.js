const connection = require("../database/sql");
const { EmbedBuilder, WebhookClient } = require('discord.js');

function remove_group(steamid, group, webhook, client) {
    connection.query(`UPDATE Wpermissions.Players SET PermissionGroups = REPLACE(PermissionGroups, ',${group}', '') WHERE SteamId = ${steamid}`, (err, results) => {
        if (err) throw err;
        if (results) {
            const webhookClient = new WebhookClient({ url: webhook });
            const embed = new EmbedBuilder()
                .setTitle('Group Removed')
                .addFields(
                    { name: `SteamID`, value: `${steamid}` },
                    { name: `Group`, value: `${group}` }
                )
                .setColor("Red");
            webhookClient.send({ embeds: [embed] });
        }
    })
}

module.exports = { remove_group }