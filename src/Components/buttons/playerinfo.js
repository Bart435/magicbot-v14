const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require("discord.js");
const connection = require('../../lib/database/sql');
const { get_steam } = require('../../lib/dataQuerys/getSteam');

module.exports = {
	name: 'playerinfo',
	customID: 'playerinfo',
	description: 'returns playerinfo embed',
	execute(interaction, client) {
        connection.query(`SELECT CAST(steamid AS CHAR) as steamid FROM wdiscordintegrator.discord_integration_players WHERE DiscordID = ${interaction.user.id} UNION SELECT CAST(steamid AS CHAR) as steamid FROM wdiscordintegrator10x.discord_integration_players WHERE DiscordID = ${interaction.user.id}`, function (err, results) {
            if (err) throw err;
            if (results <= 0) return interaction.reply({ content: "User has not linked there discord to ark", ephemeral: true })
            if (results[0].steamid <= 0) return interaction.reply({ content: "User has not linked there discord to ark", ephemeral: true })
            let steamId = `${results[0].steamid}`
            get_steam(steamId, interaction, interaction.user.id)
        });
	},
};