const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");
const { setTimeout } = require("timers/promises");

module.exports = {
	name: "roleselect",
	description: "Send role select embed and buttons",
	async execute(message, client, args) {
		const image1 = new AttachmentBuilder(
			"E:/Bart/Discord/MagicBot-100x/src/lib/assets/roleSelect/role_select_basic.png"
		);
		const image2 = new AttachmentBuilder(
			"E:/Bart/Discord/MagicBot-100x/src/lib/assets/roleSelect/role_select_boosted.png"
		);
		const image3 = new AttachmentBuilder(
			"E:/Bart/Discord/MagicBot-100x/src/lib/assets/roleSelect/role_select_modding.png"
		);

		const buttonBasic = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("basicAdd")
				.setLabel("Add 10x Role")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("basicRemove")
				.setLabel("Remove 10x Role")
				.setStyle(ButtonStyle.Danger)
		);

		const buttonBoosted = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("boostedAdd")
				.setLabel("Add 100x Role")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("boostedRemove")
				.setLabel("Remove 100x Role")
				.setStyle(ButtonStyle.Danger)
		);

		const buttonModding = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("moddingAdd")
				.setLabel("Add mods Role")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("moddingRemove")
				.setLabel("Remove mods Role")
				.setStyle(ButtonStyle.Danger)
		);

		message.channel.send({ files: [image1] });
		await setTimeout(1000);
		message.channel.send({ components: [buttonBasic] });
		await setTimeout(1000);
		message.channel.send({ files: [image2] });
		await setTimeout(1000);
		message.channel.send({ components: [buttonBoosted] });
		await setTimeout(1000);
		message.channel.send({ files: [image3] });
		await setTimeout(1000);
		message.channel.send({ components: [buttonModding] });
	},
};
