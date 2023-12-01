const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
	Embed,
} = require("discord.js");
const { setTimeout } = require("timers/promises");

module.exports = {
	name: "tokens",
	description: "Send token embed!",
	async execute(message, client, args) {
		// Deciding cluster
		let cluster = "";
		if (message.channel.parent.id == client.config.info.basicCategory)
			cluster = "10x";
		if (message.channel.parent.id == client.config.info.boostedCategory)
			cluster = "100x";

		// Getting all tokens by cluster from the config
		const tokens = client.config.tokenSystem[cluster];

		// Scrolling through them
		for (let i = 0; i < tokens.length; i++) {
			// Making sure rate limits will not be hugged
			await setTimeout(1000);

			// Creating embed and button
			const description = new EmbedBuilder()
				.setTitle(`${tokens[i].name}`)
				.setDescription(
					`${tokens[i].description}\nPrice: ${tokens[i].price}\nAmount: ${tokens[i].quantity}`
				)
				.setColor(client.config.info.embed.color);
			const buyButton = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`${tokens[i].name}`)
					.setLabel(`Buy | Price: ${tokens[i].price}`)
					.setStyle(ButtonStyle.Primary)
					.setFooter({
						text: client.config.info.embed.footer,
					})
			);

			// Sending embed with button
			message.channel.send({
				embeds: [description],
				components: [buyButton],
			});
		}
	},
};
