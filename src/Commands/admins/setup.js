const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
} = require("discord.js");
const { eventSetup } = require("../../lib/events/eventSetup");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("Setup your events")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option
				.setName("event")
				.setDescription("Select an event")
				.addChoices(
					{ name: "wipe10x", value: "wipe10x" },
					{ name: "wipe100x", value: "wipe100x" },
					{ name: "joinServer", value: "joinServer" },
					{ name: "scoreboard", value: "scoreBoard" },
					{ name: "serverSettings", value: "serverSettings" },
					{ name: "serverStatus", value: "serverStatus" },
					{ name: "serverStatus10x", value: "serverStatus10x" },
					{
						name: "serverStatus10xBeginner",
						value: "serverStatus10xBeginner",
					},
					{
						name: "serverStatusASA",
						value: "serverStatusASA",
					}
				)
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription(
					"select the channel you want the embed to live in"
				)
				.setRequired(true)
		),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {
		const event = interaction.options.getString("event");
		const channel = interaction.options.getChannel("channel");
		const channelId = channel.id;
		const guildId = interaction.guildId;
		switch (event) {
			case "wipe10x":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "wipe100x":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "joinServer":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "scoreBoard":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "serverSettings":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "serverStatus":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "serverStatus10x":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "serverStatus10xBeginner":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
			case "serverStatusASA":
				{
					eventSetup(interaction, guildId, channelId, event);
				}
				break;
		}
	},
};
