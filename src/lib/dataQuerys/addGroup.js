const connection = require("../database/sql");
const { EmbedBuilder, WebhookClient } = require('discord.js');

function add_group(steamid, group, webhook, client) {
    connection.query(`UPDATE wpermissions.Players SET PermissionGroups = CONCAT(PermissionGroups, ',${group}') WHERE SteamId = ${steamid}`, (err, results) => {
        if (err) throw err;
        if (results) {
            const webhookClient = new WebhookClient({ url: webhook });
            const embed = new EmbedBuilder()
                .setTitle('Group added')
                .addFields(
                    { name: `SteamID`, value: `${steamid}` },
                    { name: `Group`, value: `${group}` }
                )
                .setColor("Green");
            webhookClient.send({ embeds: [embed] });
        }
    })
}

module.exports = { add_group }