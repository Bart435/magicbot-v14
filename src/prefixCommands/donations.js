const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");
const { setTimeout } = require("timers/promises");

module.exports = {
	name: "donations",
	description: "Send donation embed!",
	async execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const banner = new AttachmentBuilder(
			"./src/lib/assets/banners/Artboard_10.png"
		);
		const embed = new EmbedBuilder()
			.setTitle("Support Us")
			.setColor(client.config.info.embed.color)
			.setDescription(
				"Your donations are crucial in keeping us thriving in the challenging world of Ark.\nWith your financial support, we can explore new territories and go beyond the limits.\nWe appreciate your generosity and can't thank you enough for helping us grow.\nFor more details, please visit our website or click on the button below."
			)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel("Shop")
				.setURL("https://store.magicark.co.uk/")
				.setStyle(ButtonStyle.Link)
		);
		message.channel.send({ files: [banner] });
		await setTimeout(2000);
		message.channel.send({
			embeds: [embed],
			components: [buttons],
			files: [image],
		});
	},
};
