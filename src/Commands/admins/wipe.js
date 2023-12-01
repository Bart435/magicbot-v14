const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require("discord.js");
const connection = require("../../lib/database/sql");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wipe")
		.setDescription("wipe times")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option
				.setName("server")
				.setDescription("Select a server")
				.addChoices(
					{ name: "100x", value: "100x" },
					{ name: "10x", value: "10x" }
				)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("date")
				.setDescription("date in numbers : mm/dd/yy hh:mm:ss")
				.setRequired(true)
		),

	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		if (interaction.guild.id === client.config.info.mainGuild) {
			const server = interaction.options.getString("server");
			const date_upcoming = interaction.options.getString("date");
			const date_timestamp = new Date(date_upcoming).getTime();

			connection.query(
				`UPDATE discman.wipes SET date = ${JSON.stringify(
					date_upcoming
				)}, wipe_timestamp = ${JSON.stringify(
					date_timestamp
				)} WHERE slug = ${JSON.stringify(server)}`,
				function (err, res) {
					if (err) throw err;

					if (res.affectedRows == 0) {
						connection.query(
							`INSERT INTO discman.wipes (slug, date, wipe_timestamp) VALUES (${JSON.stringify(
								server
							)}, ${JSON.stringify(
								date_upcoming
							)}, ${JSON.stringify(date_timestamp)})`,
							function (err) {
								if (err) throw err;
								interaction.reply({
									content: `wipe added and set on ${date_upcoming}`,
									ephemeral: true,
								});
							}
						);
					} else {
						interaction.reply({
							content: `Wipe is set on ${date_upcoming}`,
							ephemeral: true,
						});
					}
				}
			);
		}
	},
};
