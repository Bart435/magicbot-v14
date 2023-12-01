const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const connection = require('../../lib/database/sql');
const { get_points } = require('../../lib/dataQuerys/getPoints');
const { get_groups } = require("../../lib/dataQuerys/getGroups");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("checksteamid")
		.setDescription("Shows discord related to steamid")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addStringOption(option => option.setName('target').setDescription('steamid of the target').setRequired(true)),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		if (interaction.guild.id === client.config.info.mainGuild) {
			const steamId = interaction.options.getString("target");
			if (steamId.startsWith("<@")) return interaction.reply({ content: "Stupid cunt, use /userinfo instead", ephemeral: true })
			const sqlQuery = `SELECT CAST(DiscordID AS CHAR) as DiscordID FROM WdiscordIntegrator.discord_integration_players WHERE steamid = ${steamId}`
			connection.query(sqlQuery, function (err, results) {
				if (err) throw err;
				if (results <= 0) return interaction.reply({ content: "No data found", ephemeral: true })
				if (results[0].DiscordID <= 0) return interaction.reply({ content: "User has not linked there discord to ark", ephemeral: true })
				let discordId = `${results[0].DiscordID}`
				info(discordId, steamId, interaction)
			});

			async function info(discordId, steamId, interaction) {
				const points = await get_points(steamId)
				const permission = await get_groups(steamId)
				const image = new AttachmentBuilder('./src/lib/assets/500x500.png')
				const embed = new EmbedBuilder()
					.setColor(client.config.info.embed.color)
					.setThumbnail("attachment://500x500.png")
					.addFields(
						{ name: "Steamid:", value: `${steamId}` },
						{ name: "Discord:", value: `<@${discordId}>` },
						{ name: "Points:", value: `${points[0].Points}` },
						{ name: "Groups:", value: `${permission[0].PermissionGroups}` }
					)

				interaction.reply({ embeds: [embed], files: [image], ephemeral: true })
			}
		} else {
			return interaction.reply({ content: "only available in the official discord" })
		}
	},
};