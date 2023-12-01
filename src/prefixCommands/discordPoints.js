const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");

module.exports = {
	name: "discordpoints",
	description: "Send discord Points embed!",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Discord Points")
			.setColor(client.config.info.embed.color)
			.setDescription(
				"Click exchange to exchange discord points for Magic shop points. 2 discord points equals 1 Magic shop point (2:1) so 100 discord points equals 50 ark shop points.\n\nClick wallet to see your current amount of discord points.\nClick exchange to exchange discord points for Magic points. "
			)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("exchange")
				.setLabel("Exchange")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("wallet")
				.setLabel("Wallet")
				.setStyle(ButtonStyle.Primary)
		);

		message.channel.send({
			embeds: [embed],
			components: [buttons],
			files: [image],
		});
	},
};
