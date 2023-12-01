const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "help",
	description: "Shows all commands",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");

		const embed = new EmbedBuilder()
			.setTitle("Commands")
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		client.prefixCommands.forEach((element) => {
			embed.addFields({
				name: client.config.info.prefix + element.name,
				value: element.description,
			});
		});
		message.channel.send({ embeds: [embed], files: [image] });
	},
};
