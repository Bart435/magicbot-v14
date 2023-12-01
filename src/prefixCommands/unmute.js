const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");

module.exports = {
	name: "unmute",
	description: "Send unmute embed!",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const Buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("unmute")
				.setLabel("Unmute Request")
				.setStyle(ButtonStyle.Primary)
		);
		const Embed = new EmbedBuilder()
			.setTitle("MagicArk's Unmute system")
			.setDescription(
				"Create a unmute request to speak to a admin about your mute. Unmute isn't garantueed"
			)
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		message.channel.send({
			embeds: [Embed],
			components: [Buttons],
			files: [image],
		});
	},
};
