const {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");

const { setTimeout } = require("timers/promises");

module.exports = {
	name: "wallet",
	description: "Sends the wallet embed",
	async execute(message, client, args) {
		const banner = new AttachmentBuilder(
			"./src/lib/assets/banners/wallet_1.png"
		);
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Discord Points")
			.setDescription(
				"A new way to earn and redeem rewards on Magic Ark!\nFor every invite you send to a friend, you'll earn a whopping 250 points!\nThat's right, just one invite equals 250 points.\n\nKeep track of your Discord Points by checking your wallet, all you have to do is press the wallet button below !\nWhere you'll see your current balance.\nAnd when you're ready to redeem your points, just click the exchange button and swap your Discord Points for Magic Shop Points.\n\n**Remember, 2 Discord Points equals 1 Magic Shop Point (2:1), so 100 Discord Points equals 50 Ark Shop Points.**\n\nSo, what are you waiting for? Start earning those Discord Points and get ready to treat yourself to some epic rewards on Magic Ark!"
			)
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		const Button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("wallet")
				.setLabel("Wallet")
				.setStyle(ButtonStyle.Primary)
		);
		message.channel.send({ files: [banner] });
		await setTimeout(2000);
		message.channel.send({
			embeds: [embed],
			components: [Button],
			files: [image],
		});
	},
};
