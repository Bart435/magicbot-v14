const fetch = require('node-fetch');
const connection = require("../database/sql");
const { EmbedBuilder, WebhookClient } = require('discord.js');

async function addVotes(votersURL, client) {
    try {
        const voters = await fetch(votersURL).then(res => res.json()).then(json => json);
        for (let i = 0; i < voters.votes.length; i++) {
            connection.query(`SELECT * FROM discman.votes WHERE date = '${voters.votes[i].date}'`, (err, results) => {
                if (err) throw err;
                if (results.length == '0') {
                    connection.query(`INSERT INTO discman.votes (steamid, date) VALUES ('${voters.votes[i].steamid}', '${voters.votes[i].date}')`, (err, results) => {
                        if (err) throw err;
                        if (results) {
                            const webhookClient = new WebhookClient({ url: client.config.voteSystem.webhook });
                            const embed = new EmbedBuilder()
                            .setTitle(`${voters.name}`)
                            .addFields(
                                {name: `Nickname`, value: `${voters.votes[i].nickname}`},
                                {name: `SteamID`, value: `${voters.votes[i].steamid}`},
                                {name: `Date`, value: `${voters.votes[i].date}`}
                            )
                            .setColor("Green");
                            webhookClient.send({ embeds: [embed] });
                        }
                    })
                }
            })
        }
    } catch (error) {}   
}

async function addVotes10x(votersURL, client) {
    try {
        const voters = await fetch(votersURL).then(res => res.json()).then(json => json);
        for (let i = 0; i < voters.votes.length; i++) {
            connection.query(`SELECT * FROM discman.votes10x WHERE date = '${voters.votes[i].date}'`, (err, results) => {
                if (err) throw err;
                if (results.length == '0') {
                    connection.query(`INSERT INTO discman.votes10x (steamid, date) VALUES ('${voters.votes[i].steamid}', '${voters.votes[i].date}')`, (err, results) => {
                        if (err) throw err;
                        if (results) {
                            const webhookClient = new WebhookClient({ url: client.config.voteSystem.webhook });
                            const embed = new EmbedBuilder()
                            .setTitle(`${voters.name}`)
                            .addFields(
                                {name: `Nickname`, value: `${voters.votes[i].nickname}`},
                                {name: `SteamID`, value: `${voters.votes[i].steamid}`},
                                {name: `Date`, value: `${voters.votes[i].date}`}
                            )
                            .setColor("Green");
                            webhookClient.send({ embeds: [embed] });
                        }
                    })
                }
            })
        }
    } catch (error) {}   
}

module.exports = { addVotes, addVotes10x }