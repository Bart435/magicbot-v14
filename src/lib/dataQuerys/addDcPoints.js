const connection = require("../database/sql");
const { EmbedBuilder, WebhookClient } = require('discord.js');

function apply_DCpoints(userid, amount, client) {
    connection.query(`UPDATE discman.rewardings SET points = points + ${amount}, gainedPoints = gainedpoints + ${amount} WHERE userid = ${userid}`, (err, results) => {
        if (err) throw err;
        if (results) {
            const webhookClient = new WebhookClient({ url: client.config.inviteSystem.webhook });
            const embed = new EmbedBuilder()
            .setTitle('Points added')
            .addFields(
                {name: `User`, value: `<@${userid}>`},
                {name: `Amount`, value: `${amount}`}
            )
            .setColor("Green");
            webhookClient.send({ embeds: [embed] });
        }
    })
}

module.exports = { apply_DCpoints }