const connection = require("../database/sql");
const { EmbedBuilder, WebhookClient } = require('discord.js');

function apply_points(steamid, amount, client, x ) {
    connection.query(`UPDATE Wshop.arkshopplayers SET Points = Points + ${amount} WHERE SteamId = ${steamid}`, (err, results) => {
        if (err) throw err;
        if (results) {
            const webhookClient = new WebhookClient({ url: client.config.ingame_points.webhook });
            const embed = new EmbedBuilder()
            .setTitle('Points added')
            .addFields(
                {name: `SteamID`, value: `${steamid}`},
                {name: `Amount`, value: `${amount}`},
                {name: `Cluster`, value: `100x`}
            )
            .setColor("Green");
            webhookClient.send({ embeds: [embed] });
        }
        if (x) {
            if (results) {
                connection.query(`UPDATE discman.votes SET claimed = 1 WHERE steamid = ${steamid}`, (err) => {
                    if (err) throw err;
                })
            }
        }

    })
}

function apply_points10x(steamid, amount, client, x ) {
    const table = `10x-wshop.arkshopplayers`
    connection.query(`UPDATE wshop10x.arkshopplayers SET Points = Points + ${amount} WHERE SteamId = ${steamid}`, (err, results) => {
        if (err) throw err;
        if (results) {
            const webhookClient = new WebhookClient({ url: client.config.ingame_points.webhook });
            const embed = new EmbedBuilder()
            .setTitle('Points added')
            .addFields(
                {name: `SteamID`, value: `${steamid}`},
                {name: `Amount`, value: `${amount}`},
                {name: `Cluster`, value: `10x`}
            )
            .setColor("Green");
            webhookClient.send({ embeds: [embed] });
        }
        if (x) {
            if (results) {
                connection.query(`UPDATE discman.votes10x SET claimed = 1 WHERE steamid = ${steamid}`, (err) => {
                    if (err) throw err;
                })
            }
        }

    })
}

module.exports = { apply_points, apply_points10x }