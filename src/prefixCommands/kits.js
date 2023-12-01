const {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");
const { setTimeout } = require("timers/promises");

module.exports = {
	name: "kits",
	description: "Sends the kits ",
	async execute(message, client, args) {
		const kits = client.config.kitSystem.kits;
		for (let i = 0; i < kits.length; i++) {
			const image = new AttachmentBuilder(kits[i].filePath);
			const button = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(kits[i].name)
					.setLabel(`Buy | Price: ${kits[i].price}`)
					.setStyle(ButtonStyle.Primary)
			);
			message.channel.send({ files: [image] });
			await setTimeout(2000);
			message.channel.send({ components: [button] });
			await setTimeout(2000);
		}
	},
};
