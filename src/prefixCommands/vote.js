const {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	name: "vote",
	description: "Sends the vote embed",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const Button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("vote")
				.setLabel("Vote")
				.setStyle(ButtonStyle.Primary)
		);

		if (message.channel.parent.id == client.config.info.basicCategory) {
			const embed = new EmbedBuilder()
				.setTitle("Vote")
				.setDescription(
					`Unlock the power of voting! Gain access to our 10x server vote links by simply clicking the "Vote" button below. By doing so, you'll receive all 12 vote links, enabling you to support our server. Please note that each day you can cast a maximum of three votes, earning you 100 points in return.\n\nTo ensure a smooth experience, please verify your Discord account is linked to your Steam account through our verification system. This will streamline the process and allow you to make the most of our voting feature.`
				)
				.setColor(client.config.info.embed.color)
				.setThumbnail("attachment://500x500.png")
				.setFooter({
					text: client.config.info.embed.footer,
				});

			return message.channel.send({
				embeds: [embed],
				components: [Button],
				files: [image],
			});
		}

		if (message.channel.parent.id == client.config.info.boostedCategory) {
			const embed = new EmbedBuilder()
				.setTitle("Vote")
				.setDescription(
					`Unlock the power of voting! Gain access to our 100x server vote links by simply clicking the "Vote" button below. By doing so, you'll receive all 6 vote links, enabling you to support our server. Please note that each day you can cast a maximum of three votes, earning you 200 points in return.\n\nTo ensure a smooth experience, please verify your Discord account is linked to your Steam account through our verification system. This will streamline the process and allow you to make the most of our voting feature.`
				)
				.setColor(client.config.info.embed.color)
				.setThumbnail("attachment://500x500.png")
				.setFooter({
					text: client.config.info.embed.footer,
				});

			return message.channel.send({
				embeds: [embed],
				components: [Button],
				files: [image],
			});
		}
	},
};
