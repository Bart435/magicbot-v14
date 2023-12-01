const {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	name: "playerinfo",
	description: "Sends the playerinfo embed",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Player Info")
			.setDescription(
				"Enhance your gaming experience with just a single click! Uncover all your player information effortlessly by clicking the button below.\nTo ensure a seamless experience, make sure your accounts are linked, combining the power of Steam and Discord."
			)
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		const Button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("playerinfo")
				.setLabel("Player Info")
				.setStyle(ButtonStyle.Primary)
		);

		message.channel.send({
			embeds: [embed],
			components: [Button],
			files: [image],
		});
	},
};
