const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");

module.exports = {
	name: "ticket",
	description: "Send ticket embed!",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");

		const Buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("Ticket Basic")
				.setLabel("Ticket 10x")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("Ticket Boosted")
				.setLabel("Ticket 100x")
				.setStyle(ButtonStyle.Danger)
		);
		const buttons2 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("adminAPP")
				.setLabel("Staff Application")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("Other")
				.setLabel("Other")
				.setStyle(ButtonStyle.Success)
		);

		const Embed = new EmbedBuilder()
			.setTitle("MagicArk's Ticketing System")
			.setDescription(
				"Please choose the appropriate category below.\nA ticket can easily be made by simply clicking on one of the buttons below.\n\nIf you fail to create a ticket in it's respected category.\nOr in any way or form disrespect our staff team.\nYour ticket will be closed no matter the circumstances."
			)
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});
			
		message.channel.send({
			embeds: [Embed],
			components: [Buttons, buttons2],
			files: [image],
		});
	},
};
