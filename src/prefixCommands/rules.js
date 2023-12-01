const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");

module.exports = {
	name: "rules",
	description: "Send rules embed!",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const disembed = new EmbedBuilder()
			.setTitle("**Rules**")
			.setColor(client.config.info.embed.color)
			.setDescription(
				"Punishments can vary between cases. Constantly finding the edges of the rules can result in a punishments. Rule breaking reports, cheating reports, and questions within our servers will only be dealt with through our ticket system. If there are any problems regarding an admin. Please message 1 of the owners."
			)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		const Buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("Discord Rules")
				.setLabel("Discord Rules")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setLabel("Ingame Rules")
				.setURL("https://store.magicark.co.uk/Rules")
				.setStyle(ButtonStyle.Link)
		);
		message.channel.send({
			embeds: [disembed],
			components: [Buttons],
			files: [image],
		});
	},
};
